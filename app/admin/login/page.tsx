import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/commerce/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin — SARNSARENE",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="palette-admin flex min-h-screen items-center justify-center bg-bg px-6 font-sans text-text-light">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-serif text-xl tracking-[0.3em] uppercase">SARNSARENE</p>
          <p className="mt-2 text-[10px] tracking-widest2 uppercase text-text-muted">
            Administration
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-[10px] leading-relaxed tracking-wide text-text-muted">
          Dev credentials: admin@sarnsarene.com / sarnsarene
        </p>
      </div>
    </div>
  );
}
