import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, criticalityTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reports, type ReportType } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "PM / CM Reports — Equipment Assistant" }] }),
  component: ReportsPage,
});

function severityToCrit(s: string) {
  if (s === "High") return "Critical";
  if (s === "Medium") return "Important";
  return "Non-Critical";
}

function ReportsPage() {
  const [tab, setTab] = useState<"all" | ReportType>("all");
  const filtered = reports.filter((r) => tab === "all" || r.type === tab);

  return (
    <AppShell
      title="PM / CM Reports"
      subtitle="Inspection findings linked to equipment and spares"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" /> Upload
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All ({reports.length})</TabsTrigger>
          <TabsTrigger value="PM">
            Preventive ({reports.filter((r) => r.type === "PM").length})
          </TabsTrigger>
          <TabsTrigger value="CM">
            Corrective ({reports.filter((r) => r.type === "CM").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={r.type === "PM" ? "Preventive" : "Corrective"}
                    tone={r.type === "CM" ? "destructive" : "info"}
                  />
                  <span className="font-mono text-sm font-semibold">{r.equipmentTag}</span>
                </div>
                <p className="mt-2 text-sm">{r.findings}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Inspector: {r.inspector}</span>
                  <span>·</span>
                  <span>{r.date}</span>
                  <span>·</span>
                  <span>{r.linkedSpares} linked spare(s)</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge
                  label={`${r.severity} severity`}
                  tone={criticalityTone(severityToCrit(r.severity))}
                />
                <Button size="sm" variant="outline">
                  Open report
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
