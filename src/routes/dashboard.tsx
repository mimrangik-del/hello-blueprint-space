import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Loader2,
  Package,
  ShoppingCart,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, stockTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
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
type Equipment = Database["public"]["Tables"]["equipment"]["Row"];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Equipment Assistant" }] }),
  component: Dashboard,
});

function stockStatus(s: Spare) {
  if (s.quantity_on_hand <= 0) return "Out";
  if (s.quantity_on_hand < s.min_quantity) return "Low";
  return "OK";
}

function Dashboard() {
  const { session } = useSession();
  const [spares, setSpares] = useState<Spare[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [sp, eq] = await Promise.all([
        supabase.from("spares").select("*"),
        supabase.from("equipment").select("*"),
      ]);
      if (cancelled) return;
      setSpares(sp.data ?? []);
      setEquipment(eq.data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const criticalShortages = spares.filter(
    (s) => s.criticality === "high" && s.quantity_on_hand < s.min_quantity,
  );
  const belowMin = spares.filter((s) => s.quantity_on_hand < s.min_quantity);
  const downEquipment = equipment.filter((e) => e.status !== "operational");

  return (
    <AppShell
      title="Operations Dashboard"
      subtitle={loading ? "Loading..." : `Live data · ${equipment.length} equipment · ${spares.length} spares`}
      actions={
        <Button size="sm" asChild>
          <Link to="/spares">
            Spares <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Critical Shortages"
              value={criticalShortages.length}
              hint="High criticality below min"
              icon={AlertTriangle}
              tone="danger"
            />
            <StatCard
              label="Spares Below Min"
              value={belowMin.length}
              hint="All criticality levels"
              icon={Package}
              tone="warning"
            />
            <StatCard
              label="Equipment Down"
              value={downEquipment.length}
              hint="Not operational"
              icon={ShoppingCart}
              tone={downEquipment.length ? "danger" : undefined}
            />
            <StatCard
              label="Total Equipment"
              value={equipment.length}
              hint="Active register"
              icon={ClipboardList}
            />
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold">Spares needing attention</h2>
                <p className="text-xs text-muted-foreground">Critical or below minimum stock</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/spares">View all</Link>
              </Button>
            </div>
            {belowMin.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="All stock levels healthy"
                  description="No spares below minimum threshold."
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {belowMin.slice(0, 8).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium">{s.description}</div>
                        <div className="text-xs text-muted-foreground">{s.part_number}</div>
                      </TableCell>
                      <TableCell className="text-sm">{s.location ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {s.quantity_on_hand} / {s.min_quantity}
                      </TableCell>
                      <TableCell>
                        <StatusBadge label={stockStatus(s)} tone={stockTone(stockStatus(s))} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
