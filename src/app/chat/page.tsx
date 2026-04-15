"use client"

import { useEffect , Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatRedirectPage() {
  const router = useRouter();
  const params = useSearchParams();
  const message = params?.get("message");

  useEffect(() => {
    // preserve optional message and redirect to the main chats page
    if (message) {
      router.replace(`/chats?q=${encodeURIComponent(message)}`);
    } else {
      router.replace("/chats");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting to chat...</p>
    </div>
    </Suspense>
  );
}
