"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  OVERLAY_EASE,
  Portal,
  useEscape,
  useFocusOnOpen,
  useLockBodyScroll,
} from "./overlay";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** rendered pinned to the bottom, outside the scroll area */
  footer?: React.ReactNode;
  side?: "right" | "left";
  className?: string;
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  className,
}: Props) {
  useLockBodyScroll(open);
  useEscape(open, onClose);
  const panelRef = useFocusOnOpen(open);
  const offscreen = side === "right" ? "100%" : "-100%";

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: OVERLAY_EASE }}
          >
            <div className="absolute inset-0 bg-[#1c1a17]/40" onClick={onClose} />
            <motion.aside
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ duration: 0.4, ease: OVERLAY_EASE }}
              className={cn(
                "absolute top-0 bottom-0 flex w-full max-w-[420px] flex-col bg-bg outline-none",
                side === "right" ? "right-0 border-l" : "left-0 border-r",
                "border-text-light/10 shadow-2xl shadow-black/20",
                className,
              )}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-text-light/10 shrink-0">
                <h2 className="text-[11px] tracking-widest2 uppercase text-text-light">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="text-text-muted hover:text-text-light transition-colors text-lg leading-none -mr-1 p-1"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{children}</div>
              {footer && (
                <div className="border-t border-text-light/10 px-6 py-5 shrink-0">{footer}</div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
