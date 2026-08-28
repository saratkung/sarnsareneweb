"use client";

// ============================================================
// SARNSARENE — shopping bag state.
//
// Phase 1: client-only, persisted to localStorage. The shape is
// the CartLine[] from lib/commerce/types, so Phase 2 can POST
// this straight to an order-creation endpoint. Drawer open/close
// lives here too so any "Add to Bag" button can reveal the bag.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CartTotals, DeliveryMethodId } from "@/lib/commerce/types";
import { computeTotals } from "@/lib/commerce/checkout";

const STORAGE_KEY = "sarnsarene.bag.v1";

type AddInput = Omit<CartLine, "key" | "quantity"> & { quantity?: number };

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  totals: CartTotals;
  isOpen: boolean;
  hydrated: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (input: AddInput) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  totalsFor: (delivery: DeliveryMethodId) => CartTotals;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.key === "string" && typeof l.quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const writeRef = useRef(false);

  // hydrate once on mount
  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
    writeRef.current = true;
  }, []);

  // persist after hydration
  useEffect(() => {
    if (!writeRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota / private mode — bag simply won't persist */
    }
  }, [lines]);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLines(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const openBag = useCallback(() => setOpen(true), []);
  const closeBag = useCallback(() => setOpen(false), []);

  const addItem = useCallback((input: AddInput) => {
    const key = lineKey(input.productId, input.variantId);
    const qty = Math.max(1, input.quantity ?? 1);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key
            ? { ...l, quantity: Math.min(l.maxQuantity, l.quantity + qty) }
            : l,
        );
      }
      const line: CartLine = {
        ...input,
        key,
        quantity: Math.min(input.maxQuantity, qty),
      };
      return [...prev, line];
    });
    setOpen(true);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.key !== key) return [l];
        const next = Math.min(l.maxQuantity, Math.max(0, Math.round(quantity)));
        return next <= 0 ? [] : [{ ...l, quantity: next }];
      }),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totals = useMemo(() => computeTotals(lines, "standard"), [lines]);
  const totalsFor = useCallback(
    (delivery: DeliveryMethodId) => computeTotals(lines, delivery),
    [lines],
  );
  const itemCount = totals.itemCount;

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      totals,
      isOpen,
      hydrated,
      openBag,
      closeBag,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalsFor,
    }),
    [
      lines,
      itemCount,
      totals,
      isOpen,
      hydrated,
      openBag,
      closeBag,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalsFor,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
