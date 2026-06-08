import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-orange-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-sky-900">Bluey Quest</h1>
          <p className="mt-2 text-sky-700">
            Healthy habits, cozy rewards — no pressure, just progress.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
