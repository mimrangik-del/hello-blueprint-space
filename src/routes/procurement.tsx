import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/procurement")({
  head: () => ({ meta: [{ title: "Procurement — Equipment Assistant" }] }),
  component: ProcurementPage,
});

function ProcurementPage() {
  return (
    <AppShell title="Procurement List" subtitle="Prioritised purchase requests">
      <div className="rounded-lg border border-border bg-card p-12 shadow-sm">
        <EmptyState
          title="No procurement module yet"
          description="The procurement requests table hasn't been created in the database. Once added, your prioritised purchase list will appear here."
        />
      </div>
    </AppShell>
  );
}
