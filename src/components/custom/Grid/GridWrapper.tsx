"use client";

import dynamic from "next/dynamic";

// Lazy load Grid component - decorative, non-essential for initial paint & SEO
const Grid = dynamic(() => import("./Grid"), {
  ssr: false,
});

export default function GridWrapper() {
  return <Grid />;
}
