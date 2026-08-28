"use client";

import { useRouter } from "next/navigation";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function out() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/");
    router.refresh();
  }
  return (
    <button
      onClick={out}
      className={className ?? "text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light transition-colors"}
    >
      Sign Out
    </button>
  );
}
