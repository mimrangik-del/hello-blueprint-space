import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HardHat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Equipment Assistant" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "At least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your spares planning workspace."
      footer={
        <p>
          New here?{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="planner@cementco.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <HardHat className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">Equipment Assistant</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 mb-6 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
      <div className="relative hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.08_250),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="text-xs uppercase tracking-widest opacity-70">
            Cement plant operations
          </div>
          <div>
            <p className="text-2xl font-medium leading-snug">
              "We used to lose hours chasing spares across SAP, Excel and email. Now it's one
              ranked list — and shutdowns don't slip."
            </p>
            <p className="mt-4 text-sm opacity-70">— Maintenance Planner, Plant A</p>
          </div>
        </div>
      </div>
    </div>
  );
}
