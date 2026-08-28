"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PaletteProvider } from "@/components/theme/palette";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/site", label: "Site Content" },
  { href: "/admin/journey", label: "Journey Page" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  const SignOutButton = (
    <button
      onClick={signOut}
      className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light transition-colors"
    >
      Sign Out
    </button>
  );

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "px-3 py-2 text-[11px] tracking-widest2 uppercase transition-colors",
            isActive(pathname, item.href, item.exact)
              ? "bg-text-light text-bg"
              : "text-text-muted hover:text-text-light",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <PaletteProvider value="palette-admin">
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-text-light/10 bg-bg-secondary/40 px-4 py-6 md:flex">
        <Link href="/admin" className="mb-10 px-3">
          <span className="font-serif text-base tracking-[0.28em] uppercase text-text-light">
            SARNSARENE
          </span>
          <span className="mt-1 block text-[9px] tracking-widest2 uppercase text-text-muted">
            Administration
          </span>
        </Link>
        {links}
        <div className="mt-auto px-3 pt-6">{SignOutButton}</div>
        <Link
          href="/"
          className="mt-3 px-3 text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light transition-colors"
        >
          View Store ↗
        </Link>
      </aside>

      {/* mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-text-light/10 px-4 md:hidden">
          <span className="font-serif text-sm tracking-[0.25em] uppercase">SARNSARENE</span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[10px] tracking-widest2 uppercase text-text-muted"
          >
            {open ? "Close" : "Menu"}
          </button>
        </header>
        {open && (
          <div className="border-b border-text-light/10 bg-bg-secondary/40 px-4 py-4 md:hidden">
            {links}
            <div className="mt-4 px-3">{SignOutButton}</div>
          </div>
        )}

        <main className="flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
    </PaletteProvider>
  );
}
