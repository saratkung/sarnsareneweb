import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AuthForm } from "@/components/shop/AuthForm";

export const metadata = { title: "Create Account — SARNSARENE" };
export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/account");
  const { next = "/account" } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-20 min-h-[70vh]">
      <header className="mb-10 text-center">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="font-serif font-light text-[clamp(1.7rem,4vw,2.2rem)] tracking-[0.04em] text-text-light">
          Create Account
        </h1>
      </header>
      <AuthForm mode="register" next={next} />
    </div>
  );
}
