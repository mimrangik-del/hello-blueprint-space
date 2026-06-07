import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter, Plus, Search } from "lucide-react";
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
import { spares, plants } from "@/lib/mock-data";

export const Route = createFileRoute("/spares")({
  head: () => ({ meta: [{ title: "Spare Parts — Equipment Assistant" }] }),
  component: SparesPage,
});

function SparesPage() {
  const [q, setQ] = useState("");
  const [crit, setCrit] = useState<string>("all");
  const [plant, setPlant] = useState<string>("all");

  const filtered = useMemo(() => {
    return spares.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.code.toLowerCase().includes(q.toLowerCase()) ||
        s.equipment.toLowerCase().includes(q.toLowerCase());
      const matchC = crit === "all" || s.criticality === crit;
      const matchP = plant === "all" || s.plant === plant;
      return matchQ && matchC && matchP;
    });
  }, [q, crit, plant]);

  return (
    <AppShell
      title="Spare Parts"
      subtitle={`${filtered.length} of ${spares.length} parts`}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm">
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
              placeholder="Search part name, code or equipment..."
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
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
                <SelectItem value="Non-Critical">Non-Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={plant} onValueChange={setPlant}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plants</SelectItem>
                {plants.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No spare parts match"
              description="Try adjusting your search or filters."
              actionLabel="Clear filters"
              onAction={() => {
                setQ("");
                setCrit("all");
                setPlant("all");
              }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Lead (d)</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.code}</div>
                  </TableCell>
                  <TableCell className="text-sm">{s.equipment}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.plant}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={s.criticality}
                      tone={criticalityTone(s.criticality)}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.stock} <span className="text-muted-foreground">/ {s.minStock}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={s.status} tone={stockTone(s.status)} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{s.leadTimeDays}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${s.unitCost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AppShell>
  );
}
