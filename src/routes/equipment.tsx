import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, criticalityTone } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Equipment = Database["public"]["Tables"]["equipment"]["Row"];

export const Route = createFileRoute("/equipment")({
  head: () => ({ meta: [{ title: "Equipment — Equipment Assistant" }] }),
  component: EquipmentPage,
});

function statusTone(s: string) {
  if (s === "operational" || s === "Running") return "success" as const;
  if (s === "down" || s === "Stopped") return "destructive" as const;
  return "warning" as const;
}

function EquipmentPage() {
  const { session } = useSession();
  const [rows, setRows] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!session) return;
    load();
  }, [session]);

  const filtered = rows.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.tag.toLowerCase().includes(q.toLowerCase()) ||
      (e.plant ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  async function addSample() {
    const tag = `EQ-${Math.floor(Math.random() * 9000 + 1000)}`;
    const { error } = await supabase.from("equipment").insert({
      tag,
      name: "Sample equipment",
      plant: "Plant A",
      location: "Line 1",
      status: "operational",
      criticality: "high",
      manufacturer: "ACME",
      model: "X-100",
    });
    if (error) return toast.error(error.message);
    toast.success(`${tag} added`);
    await load();
  }

  return (
    <AppShell
      title="Equipment Register"
      subtitle={loading ? "Loading..." : `${rows.length} equipment items`}
      actions={
        <Button size="sm" onClick={addSample}>
          <Plus className="h-4 w-4" /> Add Equipment
        </Button>
      }
    >
      <div className="mb-4 relative max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by tag, name or plant..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-8"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading equipment...
        </div>
      ) : error ? (
        <EmptyState title="Couldn't load equipment" description={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? "No equipment yet" : "No matches"}
          description={
            rows.length === 0
              ? "Add your first equipment record to get started."
              : "Try a different search."
          }
          actionLabel={rows.length === 0 ? "Add sample equipment" : undefined}
          onAction={rows.length === 0 ? addSample : undefined}
        />
      ) : (
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
                  <dt className="text-muted-foreground">Plant</dt>
                  <dd className="mt-0.5 font-medium">{e.plant ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="mt-0.5 font-medium">{e.location ?? "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Manufacturer</dt>
                  <dd className="mt-0.5 font-medium">
                    {e.manufacturer ?? "—"} {e.model ? `· ${e.model}` : ""}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <StatusBadge label={e.criticality} tone={criticalityTone(e.criticality)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
