import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/budget")({
  head: () => ({ meta: [{ title: "Budget — Equipment Assistant" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  return (
    <AppShell title="Budget" subtitle="Allocation, spend and remaining balance">
      <div className="rounded-lg border border-border bg-card p-12 shadow-sm">
        <EmptyState
          title="No budget module yet"
          description="The budget table hasn't been created in the database. Once added, fiscal allocations and monthly spend will appear here."
        />
      </div>
    </AppShell>
  );
}
