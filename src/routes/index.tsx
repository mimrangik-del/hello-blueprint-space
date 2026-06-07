import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HardHat,
  Package,
  Wallet,
  ClipboardList,
  ShieldCheck,
  Gauge,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Equipment Assistant — Spare Parts & Maintenance Planning" },
      {
        name: "description",
        content:
          "Consolidate SAP stock, PM/CM reports, criticality and budget into a single planning dashboard for cement plant spares.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <HardHat className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">Equipment Assistant</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built for cement plant spares planners
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            One workspace for spares, inspections, and procurement decisions.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Stop juggling SAP exports, VLOOKUPs and email-based PM/CM reports. Equipment
            Assistant brings stock levels, criticality, inspection findings and budget into
            one prioritized view — so the right parts get ordered at the right time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Gauge,
              title: "Critical Shortage Dashboard",
              desc: "Visualize spares below minimum, grouped by criticality and plant.",
            },
            {
              icon: ClipboardList,
              title: "PM / CM Reports linked",
              desc: "Connect inspection findings directly to equipment and the spares they affect.",
            },
            {
              icon: Wallet,
              title: "Budget at a glance",
              desc: "See active budget, committed spend and remaining balance in real time.",
            },
            {
              icon: Package,
              title: "Prioritized procurement",
              desc: "Auto-rank purchase needs from priority score, lead time and criticality.",
            },
            {
              icon: ShieldCheck,
              title: "Role-based access",
              desc: "Planner, Inspector, Manager and Admin roles with clear approval flows.",
            },
            {
              icon: HardHat,
              title: "SAP-friendly import",
              desc: "Drop in your SAP Excel exports — stock, orders, consumption — in one place.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 Equipment Assistant — Frontend preview build.</p>
          <p>Mock data only · No backend connected</p>
        </div>
      </footer>
    </div>
  );
}
