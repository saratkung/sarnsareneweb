// Shared full-screen message shell for error boundaries, 404s and
// unauthorized states. Palette-agnostic — it renders whatever the
// nearest `.palette-*` class sets, falling back to the dark landing
// tokens set on <body>.

import Link from "next/link";

export function SystemMessage({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      {eyebrow && (
        <p className="mb-4 text-[10px] tracking-[0.3em] uppercase text-text-light/50">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif font-light text-[clamp(1.7rem,4vw,2.6rem)] tracking-[0.04em] text-text-light">
        {title}
      </h1>
      {body && (
        <p className="mt-4 max-w-sm text-[13px] leading-relaxed font-light text-text-muted">
          {body}
        </p>
      )}
      {actions && <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}

const linkBtn =
  "inline-flex h-11 items-center justify-center px-7 text-[10.5px] tracking-[0.25em] uppercase " +
  "border transition-colors duration-300";

export function MessageLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? `${linkBtn} bg-text-light text-bg border-text-light hover:bg-transparent hover:text-text-light`
          : `${linkBtn} border-text-light/25 text-text-light hover:border-text-light`
      }
    >
      {children}
    </Link>
  );
}
