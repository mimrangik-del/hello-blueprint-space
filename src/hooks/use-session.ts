import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession(redirectIfMissing = true) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (redirectIfMissing && !s) navigate({ to: "/login" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (redirectIfMissing && !data.session) navigate({ to: "/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirectIfMissing]);

  return { session, loading };
}
