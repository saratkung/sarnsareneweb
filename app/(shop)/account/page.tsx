import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth/session";
import { listAddresses } from "@/lib/commerce/account/addresses";
import { listOrdersForViewer } from "@/lib/commerce/orders/service";
import { getOrderViewer } from "@/lib/commerce/orders/customer";
import { formatDate, formatTHB } from "@/lib/commerce/format";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { AddressBook } from "@/components/shop/AddressBook";
import { SignOutButton } from "@/components/shop/SignOutButton";

export const metadata = { title: "Account — SARNSARENE" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();
  const [addresses, orders] = await Promise.all([
    listAddresses(user.id),
    listOrdersForViewer(await getOrderViewer()),
  ]);
  const recent = orders.slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl px-6 md:px-10 py-16 min-h-[60vh]">
      <header className="mb-12 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Account</p>
          <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.4rem)] tracking-[0.04em] text-text-light">
            {user.name || "Your Account"}
          </h1>
          <p className="mt-2 text-[12px] text-text-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[11px] tracking-widest2 uppercase text-text-light">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light"
          >
            View All →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-[12px] text-text-muted">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-text-light/10 border-y border-text-light/10">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center gap-4 py-4 hover:text-gold">
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-bg-secondary">
                    <Image src={o.items[0]?.image ?? "/images/product-1.jpg"} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-serif text-[14px] text-text-light">#{o.id}</span>
                    <span className="mt-0.5 block text-[10px] tracking-widest2 uppercase text-text-muted">
                      {formatDate(o.createdAt)}
                    </span>
                  </div>
                  <OrderStatusBadge status={o.status} />
                  <span className="shrink-0 text-[12px] tabular-nums text-text-light">
                    {formatTHB(o.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-[11px] tracking-widest2 uppercase text-text-light">
          Address Book
        </h2>
        <AddressBook addresses={addresses} />
      </section>
    </div>
  );
}
