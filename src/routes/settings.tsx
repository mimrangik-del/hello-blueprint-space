import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Equipment Assistant" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      setProfile(data);
      setName(data?.full_name ?? "");
      setLoading(false);
    })();
  }, [session]);

  async function save() {
    if (!session) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  return (
    <AppShell title="Settings" subtitle="Account and notifications">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Profile</h2>
          {loading ? (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="pname">Name</Label>
                <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pemail">Email</Label>
                <Input id="pemail" type="email" value={profile?.email ?? ""} disabled />
              </div>
              <Button size="sm" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
              </Button>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Preferences are stored locally until a backing table is added.
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Critical stock alerts",
              "Equipment status changes",
              "Weekly summary",
            ].map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
