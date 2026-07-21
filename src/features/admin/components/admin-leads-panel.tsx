"use client";

import * as React from "react";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Panel } from "@/shared/components/ui/panel";
import { useI18n } from "@/shared/i18n/provider";

interface LeadRow {
  id: string;
  email: string;
  source: string;
  credits_granted: number;
  created_at: string;
}

export function AdminLeadsPanel() {
  const { t } = useI18n();
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
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <MetricTile
          label={t("admin.leadsList")}
          value={loading ? "…" : String(stats?.totalLeads ?? leads.length)}
        />
        <MetricTile
          label={t("admin.leads7d")}
          value={loading ? "…" : String(stats?.leads7d ?? 0)}
          accent="sky"
        />
      </div>

      <Panel title={t("admin.leadsEmail")} description={t("admin.leadsDesc")}>
        {error ? (
          <p className="text-sm text-ds-coral">{error}</p>
        ) : loading ? (
          <p className="text-sm text-ds-muted">{t("common.loading")}</p>
        ) : leads.length === 0 ? (
          <p className="text-sm text-ds-muted">{t("admin.none")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-ds-border text-xs uppercase tracking-wide text-ds-muted">
                  <th className="pb-2 pr-3 font-medium">{t("common.email")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("admin.source")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("admin.credits")}</th>
                  <th className="pb-2 font-medium">{t("admin.date")}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-ds-border/50 text-ds-ink"
                  >
                    <td className="py-2 pr-3 font-medium">{lead.email}</td>
                    <td className="py-2 pr-3 text-ds-muted">{lead.source}</td>
                    <td className="py-2 pr-3 tabular-nums">
                      {lead.credits_granted}
                    </td>
                    <td className="py-2 tabular-nums text-ds-muted">
                      {new Date(lead.created_at).toLocaleString()}
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
