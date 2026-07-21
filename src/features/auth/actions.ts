"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/server/supabase/server";
import { isSupabaseConfigured } from "@/server/security/require-user";

export interface AuthActionResult {
  error?: string;
}

export async function signIn(
  _prev: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentification non configurée (Supabase manquant)." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Connexion impossible.",
    };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prev: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentification non configurée (Supabase manquant)." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || undefined,
          locale_pref: "fr",
        },
      },
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Inscription impossible.",
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Still redirect to login even if sign-out fails.
    }
  }

  redirect("/login");
}
