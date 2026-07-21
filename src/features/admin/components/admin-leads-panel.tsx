"use client";

import * as React from "react";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Panel } from "@/shared/components/ui/panel";

interface LeadRow {
  id: string;
  email: string;
  source: string;
  credits_granted: number;
  created_at: string;
}

export function AdminLeadsPanel() {
  const [leads, setLeads] = React.useState<LeadRow[]>([]);
  const [stats, setStats] = React.useState<{
    totalLeads: number;
    leads7d: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/leads");
        const data = (await res.json()) as {
          leads?: LeadRow[];
          stats?: { totalLeads: number; leads7d: number };
          error?: string;
        };
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Chargement impossible");
          return;
        }
        if (!cancelled) {
          setLeads(data.leads ?? []);
          setStats(data.stats ?? null);
        }
      } catch {
        if (!cancelled) setError("Réseau indisponible");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricTile
          label="Leads (liste)"
          value={loading ? "…" : String(stats?.totalLeads ?? leads.length)}
        />
        <MetricTile
          label="Leads 7 jours"
          value={loading ? "…" : String(stats?.leads7d ?? 0)}
          accent="sky"
        />
      </div>

      <Panel
        title="Leads email"
        description="Capture playground (gate 3ᵉ correction)"
      >
        {error ? (
          <p className="text-sm text-ds-coral">{error}</p>
        ) : loading ? (
          <p className="text-sm text-ds-muted">Chargement…</p>
        ) : leads.length === 0 ? (
          <p className="text-sm text-ds-muted">Aucun lead pour l’instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-ds-border text-xs uppercase tracking-wide text-ds-muted">
                  <th className="pb-2 pr-3 font-medium">Email</th>
                  <th className="pb-2 pr-3 font-medium">Source</th>
                  <th className="pb-2 pr-3 font-medium">Crédits</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-ds-border/50 text-ds-ink"
                  >
                    <td className="py-2.5 pr-3 font-medium">{lead.email}</td>
                    <td className="py-2.5 pr-3 text-ds-muted">{lead.source}</td>
                    <td className="py-2.5 pr-3 tabular-nums">
                      {lead.credits_granted}
                    </td>
                    <td className="py-2.5 tabular-nums text-ds-muted">
                      {new Date(lead.created_at).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
