"use client";

import * as React from "react";
import { FolderOpen, Trash2, RotateCcw } from "lucide-react";
import { Panel } from "@/shared/components/ui/panel";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import {
  deleteArchive,
  loadArchives,
  type ArchiveEntry,
} from "@/features/archives/lib/classeur-storage";
import { useI18n } from "@/shared/i18n/provider";

export interface ClasseurPanelProps {
  refreshKey?: number;
  onOpen?: (entry: ArchiveEntry) => void;
  className?: string;
}

export function ClasseurPanel({
  refreshKey = 0,
  onOpen,
  className,
}: ClasseurPanelProps) {
  const { t, locale } = useI18n();
  const [entries, setEntries] = React.useState<ArchiveEntry[]>([]);

  React.useEffect(() => {
    setEntries(loadArchives());
  }, [refreshKey]);

  const handleDelete = (id: string) => {
    deleteArchive(id);
    setEntries(loadArchives());
  };

  return (
    <Panel
      title={t("binder.title")}
      description={t("binder.desc")}
      className={className}
    >
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ds-border bg-ds-canvas/40 px-3 py-3 text-center text-xs text-ds-muted">
            {t("binder.empty")}
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className={cn(
                "rounded-xl border border-ds-border/60 bg-ds-canvas/40 p-2.5 transition-shadow hover:shadow-ds-sm"
              )}
            >
              <div className="flex items-start gap-2">
                <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-ds-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ds-ink">
                    {entry.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ds-muted">
                    {new Date(entry.updatedAt).toLocaleString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                    {" · "}
                    {entry.corrections.length} {t("editor.corr")}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1"
                  onClick={() => onOpen?.(entry)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("binder.open")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-ds-coral"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("binder.delete")}
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </Panel>
  );
}
