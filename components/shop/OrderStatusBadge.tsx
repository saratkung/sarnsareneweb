import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/commerce/orders/types";
import { ORDER_STATUS_LABEL } from "@/lib/commerce/orders/status";

const TONE: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "text-[#b98a3e] border-[#b98a3e]/40",
  PAID: "text-[#6f8f6a] border-[#6f8f6a]/40",
  PREPARING: "text-text-light border-text-light/30",
  SHIPPED: "text-text-light border-text-light/30",
  DELIVERED: "text-[#6f8f6a] border-[#6f8f6a]/40",
  COMPLETED: "text-text-muted border-text-light/20",
  CANCELLED: "text-[#9d5c4d] border-[#9d5c4d]/40",
  REFUNDED: "text-[#9d5c4d] border-[#9d5c4d]/40",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[9px] tracking-widest2 uppercase border",
        TONE[status],
        className,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
