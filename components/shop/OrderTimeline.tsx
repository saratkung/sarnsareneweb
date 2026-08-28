import { cn } from "@/lib/cn";
import type { Order } from "@/lib/commerce/orders/types";
import {
  TIMELINE_STEPS,
  isTerminated,
  timelineState,
} from "@/lib/commerce/orders/status";
import { formatDate } from "@/lib/commerce/format";

function eventTime(order: Order, status: string): string | null {
  const ev = order.events.find((e) => e.status === status);
  return ev ? formatDate(ev.at) : null;
}

export function OrderTimeline({ order }: { order: Order }) {
  if (isTerminated(order.status)) {
    return (
      <div className="border-l border-text-light/15 pl-6">
        <p className="text-[10px] tracking-widest2 uppercase text-[#9d5c4d]">
          {order.status === "CANCELLED" ? "Order Cancelled" : "Order Refunded"}
        </p>
        <p className="mt-1 text-[12px] text-text-muted">
          {eventTime(order, order.status) ?? formatDate(order.updatedAt)}
        </p>
      </div>
    );
  }

  return (
    <ol className="relative">
      {TIMELINE_STEPS.map((step, i) => {
        const state = timelineState(step.key, order.status);
        const at = eventTime(order, step.status);
        const last = i === TIMELINE_STEPS.length - 1;
        return (
          <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[3.5px] top-3 h-full w-px",
                  state === "done" ? "bg-text-light/40" : "bg-text-light/12",
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border",
                state === "done" && "bg-text-light border-text-light",
                state === "current" && "bg-gold border-gold ring-4 ring-gold/15",
                state === "upcoming" && "bg-bg border-text-light/25",
              )}
            />
            <div className="-mt-0.5">
              <p
                className={cn(
                  "text-[12px] tracking-wide",
                  state === "upcoming" ? "text-text-muted" : "text-text-light",
                  state === "current" && "font-medium",
                )}
              >
                {step.label}
              </p>
              {at && <p className="mt-0.5 text-[11px] tabular-nums text-text-muted">{at}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
