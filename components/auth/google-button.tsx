"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

export function GoogleButton({ redirectTo }: { redirectTo: string }) {
  const handleGoogle = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
  };

  return (
    <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
      Masuk dengan Google
    </Button>
  );
}
