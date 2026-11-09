"use client";

import dynamic from "next/dynamic";

// The editor renders in the browser only. Skipping server rendering keeps the large
// Keystatic UI out of the Worker bundle; the browser loads it as static assets.
const KeystaticApp = dynamic(() => import("./keystatic-app"), { ssr: false });

export default function Keystatic() {
  return <KeystaticApp />;
}
