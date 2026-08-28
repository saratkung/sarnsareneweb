"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { PaletteProvider } from "@/components/theme/palette";

export function ShopProviders({ children }: { children: ReactNode }) {
  return (
    <PaletteProvider value="palette-shop">
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </PaletteProvider>
  );
}
