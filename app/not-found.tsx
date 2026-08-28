import { SystemMessage, MessageLink } from "@/components/system/Message";

export default function RootNotFound() {
  return (
    <SystemMessage
      eyebrow="404"
      title="Page not found"
      body="The page you're looking for may have moved or no longer exists."
      actions={
        <>
          <MessageLink href="/">Home</MessageLink>
          <MessageLink href="/shop" variant="secondary">
            Shop
          </MessageLink>
        </>
      }
    />
  );
}
