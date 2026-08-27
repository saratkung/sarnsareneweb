"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

type Props = {
  items: AccordionItem[];
  /** index open by default; -1 for all closed */
  defaultOpen?: number;
  className?: string;
};

export function Accordion({ items, defaultOpen = -1, className }: Props) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className={cn("border-t border-text-light/12", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title} className="border-b border-text-light/12">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[10.5px] tracking-widest2 uppercase text-text-light">
                {item.title}
              </span>
              <span
                className={cn(
                  "text-text-muted text-lg leading-none transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pr-4 text-[13px] leading-relaxed text-text-muted font-light space-y-3">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
