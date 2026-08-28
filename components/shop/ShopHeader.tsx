"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/#story" },
];

export function ShopHeader() {
  const { itemCount, openBag, hydrated } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur-sm border-b border-text-light/10">
      <nav className="max-w-content mx-auto px-6 md:px-10 h-16 md:h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="justify-self-start flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] tracking-widest2 uppercase transition-colors duration-300",
                pathname === link.href
                  ? "text-text-light"
                  : "text-text-light/60 hover:text-text-light",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="justify-self-center font-serif text-lg tracking-[0.3em] uppercase text-text-light"
        >
          SARNSARENE
        </Link>

        <div className="justify-self-end flex items-center gap-5">
          <Link
            href="/account"
            aria-label="Account"
            className="hidden sm:block text-[10px] tracking-widest2 uppercase text-text-light/60 hover:text-text-light transition-colors duration-300"
          >
            Account
          </Link>
          <button
            type="button"
            onClick={openBag}
            className="group flex items-center gap-2 text-[10px] tracking-widest2 uppercase text-text-light/80 hover:text-text-light transition-colors duration-300"
          >
            <span>Bag</span>
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-text-light/25 px-1 text-[9px] tabular-nums transition-colors",
                hydrated && itemCount > 0 && "bg-text-light text-bg border-text-light",
              )}
            >
              {hydrated ? itemCount : 0}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
