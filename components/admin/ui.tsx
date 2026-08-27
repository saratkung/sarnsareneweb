import Link from "next/link";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl text-text-light">{title}</h1>
        {description && <p className="mt-1 text-[12px] text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-[9px] tracking-widest2 uppercase text-text-muted">{label}</p>
      <p className="mt-2 font-serif text-[26px] leading-none text-text-light tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] text-text-muted">{hint}</p>}
    </>
  );
  const cls = "block border border-text-light/10 bg-bg p-5 transition-colors";
  return href ? (
    <Link href={href} className={cn(cls, "hover:border-text-light/30")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Card({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-text-light/10 bg-bg", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-text-light/10 px-5 py-3">
          {title && (
            <h2 className="text-[10px] tracking-widest2 uppercase text-text-muted">{title}</h2>
          )}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-[12px] text-text-muted">{children}</p>;
}
