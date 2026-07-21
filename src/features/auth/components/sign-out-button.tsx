"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/shared/components/ui/button";
import { useI18n } from "@/shared/i18n/provider";

function SignOutSubmit() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      disabled={pending}
    >
      {pending ? "…" : t("common.signOut")}
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
