import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, criticalityTone, stockTone, requestTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  budget,
  dashboardStats,
  procurement,
  reports,
  spares,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Equipment Assistant" }] }),
  component: Dashboard,
});

function Dashboard() {
  const critical = spares
    .filter((s) => s.criticality === "Critical" && s.status !== "OK")
    .slice(0, 5);
  const recentRequests = procurement.slice(0, 4);
  const recentReports = reports.slice(0, 4);
  const budgetUsedPct = Math.round((budget.spent / budget.total) * 100);

  return (
    <AppShell
      title="Operations Dashboard"
      subtitle={`${budget.fiscalYear} · All plants · Last sync 2 min ago`}
      actions={
        <>
          <Button variant="outline" size="sm">
            Import SAP Export
          </Button>
          <Button size="sm" asChild>
            <Link to="/procurement">
              Procurement list <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Critical Shortages"
          value={dashboardStats.criticalShortages}
          hint="Below minimum stock"
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Spares Below Min"
          value={dashboardStats.belowMin}
          hint="All criticality levels"
          icon={Package}
          tone="warning"
        />
        <StatCard
          label="Pending Requests"
          value={dashboardStats.pendingRequests}
          hint="Awaiting manager approval"
          icon={ShoppingCart}
        />
        <StatCard
          label="Open Findings"
          value={dashboardStats.openReports}
          hint="High & medium severity"
          icon={ClipboardList}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Critical spares below stock</h2>
              <p className="text-xs text-muted-foreground">
                Top items needing attention this cycle
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/spares">View all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Lead</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {critical.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.code}</div>
                  </TableCell>
                  <TableCell className="text-sm">{s.equipment}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.stock} / {s.minStock}
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={s.status} tone={stockTone(s.status)} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {s.leadTimeDays}d
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Budget — {budget.fiscalYear}</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
            ${(budget.remaining / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-muted-foreground">Remaining of ${(budget.total / 1000).toFixed(0)}k</p>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">{budgetUsedPct}% used</span>
              <span className="tabular-nums">
                ${(budget.spent / 1000).toFixed(0)}k spent
              </span>
            </div>
            <Progress value={budgetUsedPct} />
          </div>
          <div className="mt-5 space-y-2.5">
            {budget.categories.map((c) => {
              const pct = Math.round((c.spent / c.allocated) * 100);
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs">
                    <span>{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1 h-1.5" />
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full" asChild>
            <Link to="/budget">Budget details</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent procurement requests</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/procurement">All</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {recentRequests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.spareName}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.spareCode} · Qty {r.quantity} · Priority {r.priorityScore}
                  </p>
                </div>
                <StatusBadge label={r.status} tone={requestTone(r.status)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent inspection reports</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/reports">All</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {recentReports.map((r) => (
              <li key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      label={r.type}
                      tone={r.type === "CM" ? "destructive" : "info"}
                    />
                    <span className="text-sm font-medium">{r.equipmentTag}</span>
                  </div>
                  <StatusBadge
                    label={r.severity}
                    tone={criticalityTone(
                      r.severity === "High"
                        ? "Critical"
                        : r.severity === "Medium"
                          ? "Important"
                          : "Non-Critical",
                    )}
                  />
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{r.findings}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
