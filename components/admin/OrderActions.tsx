"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/commerce/orders/types";
import type { AdminOrderAction } from "@/lib/commerce/orders/admin";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

type Props = { order: Order };

const btn =
  "inline-flex h-10 items-center justify-center px-5 text-[10px] tracking-widest2 uppercase transition-colors disabled:opacity-40";
const primary = cn(btn, "bg-text-light text-bg hover:opacity-90");
const secondary = cn(btn, "border border-text-light/25 text-text-light hover:border-text-light");
const danger = cn(btn, "border border-[#9d5c4d]/50 text-[#9d5c4d] hover:bg-[#9d5c4d]/[0.06]");

export function OrderActions({ order }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [shipOpen, setShipOpen] = useState(false);
  const [carrier, setCarrier] = useState("Thailand Post");
  const [tracking, setTracking] = useState("");
  const [confirm, setConfirm] = useState<null | "cancel" | "refund">(null);
  const [reason, setReason] = useState("");

  const disabled = busy || pending;

  async function run(action: AdminOrderAction) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Action failed.");
        return;
      }
      setShipOpen(false);
      setConfirm(null);
      setReason("");
      setTracking("");
      startTransition(() => router.refresh());
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const s = order.status;
  const terminal = s === "CANCELLED" || s === "REFUNDED" || s === "COMPLETED";

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {s === "PENDING_PAYMENT" && (
          <button className={primary} disabled={disabled} onClick={() => run({ type: "confirm_payment" })}>
            Confirm Payment
          </button>
        )}
        {s === "PAID" && (
          <button className={primary} disabled={disabled} onClick={() => run({ type: "start_preparing" })}>
            Start Preparing
          </button>
        )}
        {s === "PREPARING" && (
          <button className={primary} disabled={disabled} onClick={() => setShipOpen(true)}>
            Mark as Shipped
          </button>
        )}
        {s === "SHIPPED" && (
          <button className={primary} disabled={disabled} onClick={() => run({ type: "mark_delivered" })}>
            Mark as Delivered
          </button>
        )}
        {s === "DELIVERED" && (
          <button className={primary} disabled={disabled} onClick={() => run({ type: "mark_completed" })}>
            Mark as Completed
          </button>
        )}

        {(s === "PENDING_PAYMENT" || s === "PAID" || s === "PREPARING") && (
          <button className={danger} disabled={disabled} onClick={() => setConfirm("cancel")}>
            Cancel Order
          </button>
        )}
        {(s === "PAID" || s === "PREPARING" || s === "SHIPPED" || s === "DELIVERED") && (
          <button className={danger} disabled={disabled} onClick={() => setConfirm("refund")}>
            Refund Order
          </button>
        )}

        {terminal && (
          <p className="text-[11px] text-text-muted">No further actions for a {s.toLowerCase()} order.</p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[11px] text-[#9d5c4d]">
          {error}
        </p>
      )}

      {/* mark as shipped */}
      <Modal open={shipOpen} onClose={() => setShipOpen(false)} title="Mark as Shipped">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] tracking-widest2 uppercase text-text-muted">
              Carrier
            </span>
            <input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="h-10 w-full border-b border-text-light/25 bg-transparent text-[14px] focus:border-text-light focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] tracking-widest2 uppercase text-text-muted">
              Tracking Number
            </span>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              autoFocus
              className="h-10 w-full border-b border-text-light/25 bg-transparent text-[14px] focus:border-text-light focus:outline-none"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button className={secondary} onClick={() => setShipOpen(false)} disabled={disabled}>
              Cancel
            </button>
            <button
              className={primary}
              disabled={disabled || !carrier.trim() || !tracking.trim()}
              onClick={() =>
                run({ type: "mark_shipped", carrier: carrier.trim(), trackingNumber: tracking.trim() })
              }
            >
              {busy ? "Saving…" : "Confirm Shipment"}
            </button>
          </div>
        </div>
      </Modal>

      {/* cancel / refund confirm */}
      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "refund" ? "Refund Order" : "Cancel Order"}
      >
        <p className="text-[13px] leading-relaxed text-text-muted">
          {confirm === "refund"
            ? "This refunds the customer in full, releases reserved stock, and cannot be undone."
            : "This cancels the order and releases any reserved stock. The customer is not charged (or is refunded if already paid)."}
        </p>
        <label className="mt-5 block">
          <span className="mb-1.5 block text-[10px] tracking-widest2 uppercase text-text-muted">
            Reason (recorded in the audit log)
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            autoFocus
            className="w-full border border-text-light/20 bg-transparent p-3 text-[13px] focus:border-text-light focus:outline-none"
          />
        </label>
        <div className="mt-5 flex gap-3">
          <button className={secondary} onClick={() => setConfirm(null)} disabled={disabled}>
            Keep Order
          </button>
          <button
            className={danger}
            disabled={disabled || !reason.trim()}
            onClick={() =>
              run(
                confirm === "refund"
                  ? { type: "refund", reason: reason.trim() }
                  : { type: "cancel", reason: reason.trim() },
              )
            }
          >
            {busy ? "Working…" : confirm === "refund" ? "Refund Order" : "Cancel Order"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
