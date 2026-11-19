import type { Metadata } from "next";
import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const metadata: Metadata = {
  title: "Studio — Maison Zaytoun",
  description: "Real menu editor for Maison Zaytoun",
};

export const dynamic = "force-static";

function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-espresso px-6 text-plaster">
      <div className="max-w-lg border border-brass/30 bg-coal p-8">
        <p className="text-[12px] tracking-[0.16em] text-brass">Maison Zaytoun</p>
        <h1 className="mt-3 font-display text-3xl">Connect your Sanity project</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-plaster/65">
          Add these two values to <code className="text-brass-light">.env.local</code>, then restart the server:
        </p>
        <pre className="mt-4 overflow-x-auto border border-brass/20 bg-espresso p-4 text-[12px] text-brass-light">
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id\nNEXT_PUBLIC_SANITY_DATASET=production`}
        </pre>
        <p className="mt-4 text-[13px] text-plaster/50">
          Until then, the site keeps serving the static demo menu.
        </p>
        <Link href="/" className="mt-6 inline-block border-b border-brass pb-1 text-[12px] text-brass-light">
          Back to the restaurant
        </Link>
      </div>
    </main>
  );
}

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <SetupNotice />;
  return <NextStudio config={config} />;
}
