"use client";

import { useState, useCallback } from "react";
import Script from "next/script";
import CookieBanner from "./CookieBanner";

export default function AnalyticsConsent({ gaId }: { gaId: string }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleConsent = useCallback((accepted: boolean) => {
    setAnalyticsEnabled(accepted);
  }, []);

  return (
    <>
      <CookieBanner onConsent={handleConsent} />
      {analyticsEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
