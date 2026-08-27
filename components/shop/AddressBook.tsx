"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SavedAddress } from "@/lib/commerce/account/addresses";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const EMPTY = { fullName: "", line1: "", district: "", province: "", postalCode: "" };

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(addresses.length === 0);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not save.");
        return;
      }
      setForm(EMPTY);
      setAdding(false);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    refresh();
  }
  async function makeDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    refresh();
  }

  return (
    <div>
      {addresses.length > 0 && (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-4 border border-text-light/12 p-4"
            >
              <div className="text-[12.5px] leading-relaxed text-text-muted">
                <span className="block text-text-light">
                  {a.fullName}
                  {a.isDefault && (
                    <span className="ml-2 text-[9px] tracking-widest2 uppercase text-gold">
                      Default
                    </span>
                  )}
                </span>
                {a.line1}
                <br />
                {a.district}, {a.province} {a.postalCode}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-[9px] tracking-widest2 uppercase">
                {!a.isDefault && (
                  <button onClick={() => makeDefault(a.id)} className="text-text-muted hover:text-text-light">
                    Set Default
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="text-text-muted hover:text-[#9d5c4d]">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form onSubmit={add} className="mt-4 space-y-4 border border-text-light/12 p-4">
          <TextField label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <TextField label="Address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            <TextField label="Province" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
            <TextField
              label="Postal Code"
              inputMode="numeric"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              error={error ?? undefined}
            />
          </div>
          <div className="flex gap-3">
            {addresses.length > 0 && (
              <Button type="button" variant="secondary" onClick={() => setAdding(false)} disabled={busy}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save Address"}
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 text-[10px] tracking-widest2 uppercase text-text-muted underline underline-offset-4 hover:text-text-light"
        >
          Add Address
        </button>
      )}
    </div>
  );
}
