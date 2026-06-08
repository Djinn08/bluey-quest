"use server";

import type { AuthError } from "@supabase/supabase-js";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { ERRORS, friendlyAuthError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function signIn(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: ERRORS.signUpRequired };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Sign in error:", {
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return { error: ERRORS.signIn };
    }

    console.info("Sign in success:", {
      userId: data.user?.id,
      hasSession: !!data.session,
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("signIn unexpected error:", err);
    return { error: ERRORS.connection };
  }
}

export async function signUp(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: ERRORS.signUpRequired };
  }

  if (password.length < 6) {
    return { error: ERRORS.signUpPassword };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup error:", {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
      });
      return { error: friendlyAuthError(error as AuthError) };
    }

    console.info("Signup success:", {
      userId: data.user?.id,
      hasSession: !!data.session,
      emailConfirmed: !!data.user?.email_confirmed_at,
    });

    // Email confirmation enabled — account created but no session yet
    if (!data.session) {
      return {
        success: true,
        message: ERRORS.signUpConfirmEmail,
      };
    }

    // Email confirmation disabled — signed in immediately
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("signUp unexpected error:", err);
    return { error: ERRORS.connection };
  }
}
