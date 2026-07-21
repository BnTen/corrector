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

  redirect("/workspace");
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

  redirect("/workspace");
}

export async function signOut(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentification non configurée (Supabase manquant)." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Déconnexion impossible.",
    };
  }

  redirect("/login");
}
