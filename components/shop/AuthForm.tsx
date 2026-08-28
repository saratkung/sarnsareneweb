"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? form : { email: form.email, password: form.password },
        ),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Something went wrong.");
        setBusy(false);
        return;
      }
      router.replace(next || "/account");
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {isRegister && (
        <TextField
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus={!isRegister}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        hint={isRegister ? "At least 8 characters" : undefined}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        error={error ?? undefined}
      />
      <Button type="submit" fullWidth size="lg" disabled={busy}>
        {busy ? "Please wait…" : isRegister ? "Create Account" : "Sign In"}
      </Button>

      <p className="text-center text-[11px] text-text-muted">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="text-text-light underline underline-offset-4">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to SARNSARENE?{" "}
            <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="text-text-light underline underline-offset-4">
              Create an account
            </Link>
          </>
        )}
      </p>
      <p className="text-center text-[11px] text-text-muted">
        or{" "}
        <Link href="/shop" className="text-text-light underline underline-offset-4">
          continue as a guest
        </Link>
      </p>
    </form>
  );
}
