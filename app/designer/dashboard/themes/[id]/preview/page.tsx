"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { ThemeConfig, defaultThemeConfig } from "@/components/creator/ThemeTypes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PreviewThemePage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.id as string;
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [themeName, setThemeName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const response = await fetch(`/api/designer/themes/${themeId}`);
        if (response.ok) {
          const data = await response.json();
          setThemeName(data.name);
          setConfig(data.config || defaultThemeConfig);
        } else {
          router.push("/designer/dashboard/themes");
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
        router.push("/designer/dashboard/themes");
      } finally {
        setIsLoading(false);
      }
    }
    if (themeId) {
      fetchTheme();
    }
  }, [themeId, router]);

  const updateConfig = () => {
    // Preview mode - no updates allowed
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-full max-w-md h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/designer/dashboard/themes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Preview: {themeName}</h1>
          <p className="text-muted-foreground">Preview your theme design</p>
        </div>
      </div>

      <div className="flex justify-center">
        <CreatorCard config={config} updateConfig={updateConfig} />
      </div>
    </div>
  );
}


