import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Equipment Assistant" }] }),
  component: SettingsPage,
});

const users = [
  { name: "Muhammad Imran", email: "m.imran@cementco.com", role: "Planner", active: true },
  { name: "Aisha Khan", email: "a.khan@cementco.com", role: "Inspector", active: true },
  { name: "Rashid Ahmed", email: "r.ahmed@cementco.com", role: "Manager", active: true },
  { name: "Sara Bhatti", email: "s.bhatti@cementco.com", role: "Inspector", active: false },
];

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Account, users and notifications">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Profile</h2>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="pname">Name</Label>
                <Input id="pname" defaultValue="Muhammad Imran" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pemail">Email</Label>
                <Input id="pemail" type="email" defaultValue="m.imran@cementco.com" />
              </div>
              <Button size="sm">Save changes</Button>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <div className="mt-4 space-y-3">
              {[
                "Critical stock alerts",
                "New PM / CM reports",
                "Procurement approvals",
                "Weekly budget summary",
              ].map((label, i) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="lg:col-span-2 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Team members</h2>
              <p className="text-xs text-muted-foreground">Manage roles and access</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Invite user
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {users.map((u) => (
              <li key={u.email} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={u.role} tone="info" />
                  <StatusBadge
                    label={u.active ? "Active" : "Inactive"}
                    tone={u.active ? "success" : "neutral"}
                  />
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
