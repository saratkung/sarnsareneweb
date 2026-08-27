import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans uppercase tracking-widest2 " +
  "text-[10.5px] transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-text-light text-bg border border-text-light hover:bg-transparent hover:text-text-light",
  secondary:
    "bg-transparent text-text-light border border-text-light/25 hover:border-text-light",
  ghost:
    "bg-transparent text-text-light border-b border-transparent hover:border-gold px-0 tracking-widest2",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-7",
  lg: "h-14 px-10",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        variant !== "ghost" && sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

type ButtonLinkProps = CommonProps & {
  href: string;
  prefetch?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: string;
  rel?: string;
};

export function ButtonLink({
  href,
  prefetch,
  onClick,
  target,
  rel,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={onClick}
      target={target}
      rel={rel}
      className={cn(
        base,
        variants[variant],
        variant !== "ghost" && sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}
