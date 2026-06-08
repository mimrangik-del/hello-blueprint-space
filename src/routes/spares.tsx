import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter, Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, criticalityTone, stockTone } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Spare = Database["public"]["Tables"]["spares"]["Row"];

export const Route = createFileRoute("/spares")({
  head: () => ({ meta: [{ title: "Spare Parts — Equipment Assistant" }] }),
  component: SparesPage,
});

function stockStatus(s: Spare) {
  if (s.quantity_on_hand <= 0) return "Out";
  if (s.quantity_on_hand < s.min_quantity) return "Low";
  return "OK";
}

function SparesPage() {
  const { session } = useSession();
  const [rows, setRows] = useState<Spare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [crit, setCrit] = useState<string>("all");

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("spares")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) setError(error.message);
      else setRows(data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const filtered = useMemo(
    () =>
      rows.filter((s) => {
        const ql = q.toLowerCase();
        const matchQ =
          !q ||
          s.description.toLowerCase().includes(ql) ||
          s.part_number.toLowerCase().includes(ql);
        const matchC = crit === "all" || s.criticality === crit;
        return matchQ && matchC;
      }),
    [rows, q, crit],
  );

  async function addSample() {
    const { error } = await supabase.from("spares").insert({
      part_number: `PN-${Math.floor(Math.random() * 9000 + 1000)}`,
      description: "Sample spare part",
      quantity_on_hand: 5,
      min_quantity: 10,
      unit_cost: 250,
      criticality: "high",
      status: "in_stock",
      location: "Warehouse A",
    });
    if (error) return toast.error(error.message);
    toast.success("Spare added");
    const { data } = await supabase
      .from("spares")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  }

  return (
    <AppShell
      title="Spare Parts"
      subtitle={loading ? "Loading..." : `${filtered.length} of ${rows.length} parts`}
      actions={
        <>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={addSample}>
            <Plus className="h-4 w-4" /> Add Spare
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search part name or code..."
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={crit} onValueChange={setCrit}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All criticality</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading spares...
          </div>
        ) : error ? (
          <div className="p-6">
            <EmptyState title="Couldn't load spares" description={error} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={rows.length === 0 ? "No spare parts yet" : "No matches"}
              description={
                rows.length === 0
                  ? "Add your first spare part to get started."
                  : "Try adjusting your search or filters."
              }
              actionLabel={rows.length === 0 ? "Add sample spare" : "Clear filters"}
              onAction={
                rows.length === 0
                  ? addSample
                  : () => {
                      setQ("");
                      setCrit("all");
                    }
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const status = stockStatus(s);
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.description}</div>
                      <div className="text-xs text-muted-foreground">{s.part_number}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.location ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={s.criticality}
                        tone={criticalityTone(s.criticality)}
                      />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {s.quantity_on_hand}{" "}
                      <span className="text-muted-foreground">/ {s.min_quantity}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={status} tone={stockTone(status)} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      ${Number(s.unit_cost ?? 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </AppShell>
  );
}
