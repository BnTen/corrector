"use client";

import * as React from "react";
import { FolderOpen, Trash2, Plus, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import {
  createEmptyArchive,
  deleteArchive,
  loadArchives,
  type ArchiveEntry,
} from "@/features/archives/lib/classeur-storage";
import { useI18n } from "@/shared/i18n/provider";

export interface ClasseurPanelProps {
  refreshKey?: number;
  activeId?: string | null;
  onOpen?: (entry: ArchiveEntry) => void;
  onCreated?: (entry: ArchiveEntry) => void;
  className?: string;
  /** Compact rail mode (no Panel chrome). */
  rail?: boolean;
}

export function ClasseurPanel({
  refreshKey = 0,
  activeId,
  onOpen,
  onCreated,
  className,
  rail = true,
}: ClasseurPanelProps) {
  const { t, locale } = useI18n();
  const [entries, setEntries] = React.useState<ArchiveEntry[]>([]);

  React.useEffect(() => {
    setEntries(loadArchives());
  }, [refreshKey]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteArchive(id);
    setEntries(loadArchives());
  };

  const handleNew = () => {
    const created = createEmptyArchive(
      locale === "fr" ? "Nouveau texte" : "New text"
    );
    setEntries(loadArchives());
    onCreated?.(created);
    onOpen?.(created);
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="mb-2 shrink-0 space-y-2">
        {!rail ? (
          <div>
            <h2 className="text-sm font-semibold text-ds-ink">
              {t("binder.title")}
            </h2>
            <p className="text-[11px] text-ds-muted">{t("binder.desc")}</p>
          </div>
        ) : (
          <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-ds-muted">
            {t("binder.title")}
          </p>
        )}

        <Button
          type="button"
          onClick={handleNew}
          className="w-full rounded-full gap-1.5"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          {t("binder.new")}
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ds-border bg-ds-canvas/40 px-3 py-3 text-center text-xs text-ds-muted">
            {t("binder.empty")}
          </p>
        ) : (
          entries.map((entry) => {
            const isActive = activeId === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onOpen?.(entry)}
                className={cn(
                  "group flex w-full items-start gap-2 rounded-xl border px-2.5 py-2 text-left transition",
                  isActive
                    ? "border-ds-inverse/20 bg-ds-inverse text-white shadow-ds-sm"
                    : "border-transparent bg-ds-canvas/50 hover:border-ds-border/60 hover:bg-white"
                )}
              >
                {isActive ? (
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ds-lime" />
                ) : (
                  <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-ds-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      isActive ? "text-white" : "text-ds-ink"
                    )}
                  >
                    {entry.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px]",
                      isActive ? "text-white/60" : "text-ds-muted"
                    )}
                  >
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
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleDelete(entry.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleDelete(entry.id, e as unknown as React.MouseEvent);
                  }}
                  className={cn(
                    "rounded-md p-1 opacity-0 transition group-hover:opacity-100",
                    isActive
                      ? "text-white/70 hover:bg-white/10"
                      : "text-ds-coral hover:bg-ds-coral/10"
                  )}
                  aria-label={t("binder.delete")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
