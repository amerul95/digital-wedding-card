"use client";

import { CeremonyCard } from "@/components/card/CeremonyCard";

export default function PreviewPage() {
  // Don't pass event prop - let CeremonyCard use context which has saved data
  return <CeremonyCard />;
}
