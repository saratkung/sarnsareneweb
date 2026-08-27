import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderViewer } from "@/lib/commerce/orders/customer";
import { getOrderForViewer } from "@/lib/commerce/orders/service";
import { OrderDetailView } from "@/components/shop/OrderDetailView";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id} — SARNSARENE` };
}

export default async function OrderDetailPage({ params }: Params) {
  const { id } = await params;
  const order = await getOrderForViewer(id, await getOrderViewer());
  if (!order) notFound();

  return <OrderDetailView order={order} />;
}
