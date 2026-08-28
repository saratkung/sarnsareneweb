import { getCurrentUser } from "@/lib/auth/session";
import { listAddresses } from "@/lib/commerce/account/addresses";
import { EMPTY_CHECKOUT_DRAFT } from "@/lib/commerce/checkout";
import { CheckoutView } from "@/components/shop/CheckoutView";
import type { CheckoutDraft } from "@/lib/commerce/types";

export const metadata = { title: "Checkout — SARNSARENE" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  let defaults: CheckoutDraft = EMPTY_CHECKOUT_DRAFT;

  if (user) {
    const addresses = await listAddresses(user.id);
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    defaults = {
      ...EMPTY_CHECKOUT_DRAFT,
      contact: { email: user.email, phone: user.phone ?? "" },
      shipping: def
        ? {
            fullName: def.fullName,
            address: def.line1,
            district: def.district,
            province: def.province,
            postalCode: def.postalCode,
          }
        : { ...EMPTY_CHECKOUT_DRAFT.shipping, fullName: user.name ?? "" },
    };
  }

  return <CheckoutView defaults={defaults} />;
}
