"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "./overlay";

const EASE = [0.16, 1, 0.3, 1] as const;

type Toast = {
  id: number;
  message: string;
  action?: { label: string; href: string };
};

type ToastContextValue = {
  notify: (message: string, action?: Toast["action"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback<ToastContextValue["notify"]>(
    (message, action) => {
      const id = ++seq.current;
      setToasts((list) => [...list.slice(-2), { id, message, action }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 4200),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <Portal>
        <div className="fixed bottom-6 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-center justify-between gap-4 bg-[#2B2B2B] px-5 py-4 text-[#FEF5E1] shadow-xl shadow-black/25"
              >
                <span className="text-[12px] tracking-wide">{t.message}</span>
                {t.action && (
                  <a
                    href={t.action.href}
                    className="shrink-0 text-[10px] tracking-widest2 uppercase text-[#CDA364] hover:text-[#FEF5E1] transition-colors"
                  >
                    {t.action.label}
                  </a>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
