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
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: Props) {
  useLockBodyScroll(open);
  useEscape(open, onClose);
  const panelRef = useFocusOnOpen(open);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: OVERLAY_EASE }}
          >
            <div
              className="absolute inset-0 bg-[#1c1a17]/40 backdrop-blur-[2px]"
              onClick={onClose}
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.32, ease: OVERLAY_EASE }}
              className={cn(
                "relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-bg",
                "border border-text-light/10 shadow-2xl shadow-black/20 outline-none",
                className,
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-text-light/10">
                  <h2 className="font-serif text-[19px] text-text-light">{title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="text-text-muted hover:text-text-light transition-colors text-lg leading-none -mr-1 p-1"
                  >
                    &times;
                  </button>
                </div>
              )}
              <div className="px-6 sm:px-8 py-6">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
