import { cn } from "@/lib/utils";

type Tone = "critical" | "important" | "neutral" | "success" | "warning" | "info" | "destructive";

const toneStyles: Record<Tone, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  important: "bg-warning/15 text-warning-foreground border-warning/30",
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-info/10 text-info border-info/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function criticalityTone(c: string): Tone {
  if (c === "Critical") return "critical";
  if (c === "Important") return "important";
  return "neutral";
}

export function stockTone(s: string): Tone {
  if (s === "Out") return "destructive";
  if (s === "Low") return "warning";
  return "success";
}

export function requestTone(s: string): Tone {
  if (s === "Pending") return "warning";
  if (s === "Approved") return "info";
  if (s === "Ordered") return "success";
  if (s === "Rejected") return "destructive";
  return "neutral";
}
