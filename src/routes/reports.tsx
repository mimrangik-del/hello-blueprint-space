import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "PM / CM Reports — Equipment Assistant" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AppShell
      title="PM / CM Reports"
      subtitle="Inspection findings linked to equipment and spares"
    >
      <div className="rounded-lg border border-border bg-card p-12 shadow-sm">
        <EmptyState
          title="No reports module yet"
          description="The reports table hasn't been created in the database. Once added, inspection findings will appear here."
        />
      </div>
    </AppShell>
  );
}
