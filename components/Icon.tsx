type IconProps = {
  className?: string;
};

const base = "stroke-current fill-none";

export function DropIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M12 3s7 7.5 7 12.5a7 7 0 1 1-14 0C5 10.5 12 3 12 3z" />
    </svg>
  );
}

export function CircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M12 21C12 21 5 17 5 10a7 7 0 0 1 14 0c0 7-7 11-7 11z" />
      <path d="M12 21V10" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <rect x="4" y="9" width="16" height="11" />
      <path d="M4 9h16M12 9v11M12 9c-1.4-4-6-4-6-1.3S9 9 12 9zM12 9c1.4-4 6-4 6-1.3S15 9 12 9z" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}

export function WeaveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1} className={`${base} ${className ?? ""}`}>
      <path d="M4 5v14M9 5v14M15 5v14M20 5v14" strokeDasharray="3.2 2.2" />
      <path d="M2 8h20M2 12h20M2 16h20" />
    </svg>
  );
}

export const icons = {
  drop: DropIcon,
  circle: CircleIcon,
  leaf: LeafIcon,
  spark: SparkIcon,
  box: BoxIcon,
  gift: GiftIcon,
  chat: ChatIcon,
  globe: GlobeIcon,
  weave: WeaveIcon,
};

export type IconName = keyof typeof icons;
