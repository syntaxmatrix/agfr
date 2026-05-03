"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove?: (widgetId: string) => void;
      reset?: (widgetId?: string) => void;
    };
  }
}

type CloudflareTurnstileProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
};

const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
const TURNSTILE_PRODUCTION_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADIau--nRDc0o5Lh";

export default function CloudflareTurnstile({
  onVerify,
  onExpire,
  className,
}: CloudflareTurnstileProps) {
  const id = useId().replace(/:/g, "");
  const containerId = `turnstile-${id}`;
  const widgetIdRef = useRef<string | null>(null);
  const hasRenderedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);

  const getSiteKey = useCallback(() => {
    if (typeof window === "undefined") {
      return TURNSTILE_PRODUCTION_SITE_KEY;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    return isLocalhost ? TURNSTILE_TEST_SITE_KEY : TURNSTILE_PRODUCTION_SITE_KEY;
  }, []);

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  const mountWidget = useCallback(() => {
    if (!scriptReady || !window.turnstile || hasRenderedRef.current) {
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: getSiteKey(),
      callback: onVerify,
      "expired-callback": handleExpire,
      "error-callback": handleExpire,
      theme: "light",
    });
    hasRenderedRef.current = true;
  }, [containerId, getSiteKey, handleExpire, onVerify, scriptReady]);

  useEffect(() => {
    if (window.turnstile) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    mountWidget();
  }, [mountWidget]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div id={containerId} className={className} />
    </>
  );
}
