"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initial: AuthResult = {};

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initial);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initial);

  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  useEffect(() => {
    if (signInState.success) {
      window.location.assign("/");
    }
  }, [signInState.success]);

  useEffect(() => {
    if (signUpState.success && signUpState.message) {
      return;
    }
    if (signUpState.success) {
      window.location.assign("/");
    }
  }, [signUpState.success, signUpState.message]);

  function handleModeSwitch() {
    setMode(mode === "signin" ? "signup" : "signin");
  }

  return (
    <Card>
      <form action={mode === "signin" ? signInAction : signUpAction} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-sky-800">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-sky-800">Password</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={6}
            className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </label>

        {state.error && (
          <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-900" role="alert">
            {state.error}
          </p>
        )}

        {state.success && state.message && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
            {state.message}
          </p>
        )}

        <Button type="submit" fullWidth disabled={pending}>
          {pending ? "One moment..." : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 w-full text-center text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
        onClick={handleModeSwitch}
      >
        {mode === "signin"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </Card>
  );
}
