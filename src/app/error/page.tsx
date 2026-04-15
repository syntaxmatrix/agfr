"use client"

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ErrorRedirectPage() {
  const router = useRouter();
  const params = useSearchParams();
  const message = params?.get("message") || params?.get("error") || "An error occurred";

  useEffect(() => {
    // show a lightweight page then forward to login with message or to home
    // for now redirect to login and pass message as query param
    router.replace(`/login?message=${encodeURIComponent(message)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Handling error... Redirecting</p>
    </div>
    </Suspense>
  );
}
