import type { Metadata } from "next";
import { requireAdmin } from "@/lib/commerce/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin — SARNSARENE",
  robots: { index: false, follow: false },
};

// Admin runs on a cooler, greyer palette than the warm-ivory storefront
// — a deliberately separate surface (§15) on the same token system, via
// the `.palette-admin` class in app/globals.css.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="palette-admin bg-bg font-sans text-text-light antialiased">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
