"use client";

import { CeremonyCard } from "@/components/card/CeremonyCard";

export default function DesignerPreviewPage() {
  // Use the same component as /preview - CeremonyCard will use context which has saved data
  return <CeremonyCard />;
}
