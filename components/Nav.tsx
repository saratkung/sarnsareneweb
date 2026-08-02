"use client";

import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-content mx-auto px-6 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        <a
          href="#"
          className="font-serif text-lg tracking-[0.3em] uppercase text-text-light"
        >
          {brand.name}
        </a>
        <ul className="hidden md:flex items-center gap-10">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#collection"
          className="text-[10px] tracking-widest2 uppercase text-text-light border-b border-gold pb-1 hidden md:inline-block"
        >
          Shop
        </a>
      </nav>
    </header>
  );
}
