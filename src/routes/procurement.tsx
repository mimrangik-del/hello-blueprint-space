import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, requestTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
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
import { procurement, type RequestStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/procurement")({
  head: () => ({ meta: [{ title: "Procurement — Equipment Assistant" }] }),
  component: ProcurementPage,
});

function ProcurementPage() {
  const [status, setStatus] = useState<"all" | RequestStatus>("all");
  const filtered = [...procurement]
    .filter((p) => status === "all" || p.status === status)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const totalEst = filtered.reduce((sum, p) => sum + p.estimatedCost * p.quantity, 0);

  return (
    <AppShell
      title="Procurement List"
      subtitle={`${filtered.length} requests · Estimated total $${totalEst.toLocaleString()}`}
      actions={
        <Button size="sm">
          <Download className="h-4 w-4" /> Export to Excel
        </Button>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Ordered">Ordered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Priority</TableHead>
              <TableHead>Part</TableHead>
              <TableHead>Justification</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Est. cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const urgent = p.priorityScore >= 8;
              return (
                <TableRow key={p.id}>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold tabular-nums ${
                        urgent
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {p.priorityScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{p.spareName}</div>
                    <div className="text-xs text-muted-foreground">{p.spareCode}</div>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {p.justification}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{p.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${(p.estimatedCost * p.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={p.status} tone={requestTone(p.status)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {p.status === "Pending" ? (
                        <>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-success">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8">
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
