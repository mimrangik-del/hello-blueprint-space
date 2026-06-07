import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { Wallet, TrendingDown, Clock } from "lucide-react";
import { budget } from "@/lib/mock-data";

export const Route = createFileRoute("/budget")({
  head: () => ({ meta: [{ title: "Budget — Equipment Assistant" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const max = Math.max(...budget.monthlySpend.map((m) => m.spend));

  return (
    <AppShell
      title={`Budget — ${budget.fiscalYear}`}
      subtitle="Allocation, spend and remaining balance"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Budget"
          value={`$${(budget.total / 1000).toFixed(0)}k`}
          icon={Wallet}
        />
        <StatCard
          label="Spent"
          value={`$${(budget.spent / 1000).toFixed(0)}k`}
          hint={`${Math.round((budget.spent / budget.total) * 100)}% of total`}
          icon={TrendingDown}
          tone="warning"
        />
        <StatCard
          label="Remaining"
          value={`$${(budget.remaining / 1000).toFixed(0)}k`}
          hint={`Committed $${(budget.committed / 1000).toFixed(0)}k`}
          icon={Clock}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">By category</h2>
          <div className="mt-4 space-y-4">
            {budget.categories.map((c) => {
              const pct = Math.round((c.spent / c.allocated) * 100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      ${(c.spent / 1000).toFixed(0)}k / ${(c.allocated / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Monthly spend (thousands)</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {budget.monthlySpend.map((m) => {
              const h = (m.spend / max) * 100;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-accent"
                      style={{ height: `${h}%` }}
                      title={`$${m.spend}k`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
