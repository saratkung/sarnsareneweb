"use client";

import { motion } from "framer-motion";
import { STAGES } from "./timeline";
import { cn } from "@/lib/cn";

export function ProcessIndicator({
  active,
  animate = true,
}: {
  active: number;
  animate?: boolean;
}) {
  return (
    <div className="mt-7 select-none">
      <div className="flex items-center justify-between px-1">
        {STAGES.map((s) => (
          <span
            key={s.key}
            className={cn(
              "text-[8px] tracking-[0.2em] tabular-nums transition-colors duration-500",
              s.index === active ? "text-text-light" : "text-text-light/30",
            )}
          >
            {String(s.index + 1).padStart(2, "0")}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center">
        {STAGES.map((s, i) => {
          const done = i < active;
          const isActive = i === active;
          return (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                {isActive && animate && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-text-light/40"
                    animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500",
                    done && "h-[7px] w-[7px] bg-text-light",
                    isActive && "h-[7px] w-[7px] border border-text-light bg-text-light",
                    !done && !isActive && "h-[6px] w-[6px] border border-text-light/30",
                  )}
                />
              </span>
              {i < STAGES.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 transition-colors duration-500",
                    i < active ? "bg-text-light/40" : "bg-text-light/12",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
