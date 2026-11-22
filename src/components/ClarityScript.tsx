"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const PROJECT_ID = (process.env.NEXT_PUBLIC_CLARITY_ID || "").replace(/[^a-zA-Z0-9]/g, "");

/** Loads Clarity on customer pages only; owner tools stay out of the data. */
export default function ClarityScript() {
  const pathname = usePathname();
  if (!PROJECT_ID || pathname.startsWith("/studio") || pathname.startsWith("/admin")) {
    return null;
  }

  const snippet = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","${PROJECT_ID}");`;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
