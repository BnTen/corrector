"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/shared/components/ui/button";

function SignOutSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      disabled={pending}
    >
      {pending ? "…" : "Déconnexion"}
    </Button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <SignOutSubmit />
    </form>
  );
}
