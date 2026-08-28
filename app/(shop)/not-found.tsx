import { ButtonLink } from "@/components/ui/Button";

export default function ShopNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.6rem)] tracking-[0.04em] text-text-light">
        This piece can&apos;t be found
      </h1>
      <p className="mt-4 max-w-sm text-[13px] leading-relaxed font-light text-text-muted">
        The page you are looking for may have been moved, or the item is no longer part of
        the collection.
      </p>
      <ButtonLink href="/shop" className="mt-10">
        Return to Shop
      </ButtonLink>
    </div>
  );
}
