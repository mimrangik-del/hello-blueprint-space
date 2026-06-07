import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Wrench } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, criticalityTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { equipment } from "@/lib/mock-data";

export const Route = createFileRoute("/equipment")({
  head: () => ({ meta: [{ title: "Equipment — Equipment Assistant" }] }),
  component: EquipmentPage,
});

function statusTone(s: string) {
  if (s === "Running") return "success" as const;
  if (s === "Stopped") return "destructive" as const;
  return "warning" as const;
}

function EquipmentPage() {
  const [q, setQ] = useState("");
  const filtered = equipment.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.tag.toLowerCase().includes(q.toLowerCase()) ||
      e.area.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell
      title="Equipment Register"
      subtitle={`${equipment.length} equipment items across all plants`}
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add Equipment
        </Button>
      }
    >
      <div className="mb-4 relative max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by tag, name or area..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{e.tag}</p>
                  <h3 className="text-sm font-semibold">{e.name}</h3>
                </div>
              </div>
              <StatusBadge label={e.status} tone={statusTone(e.status)} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Area</dt>
                <dd className="mt-0.5 font-medium">{e.area}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="mt-0.5 font-medium">{e.type}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Plant</dt>
                <dd className="mt-0.5 font-medium">{e.plant}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <StatusBadge label={e.criticality} tone={criticalityTone(e.criticality)} />
              <Button variant="ghost" size="sm">
                View details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
