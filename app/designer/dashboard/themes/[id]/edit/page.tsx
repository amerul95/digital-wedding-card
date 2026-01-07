"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { defaultThemeConfig, ThemeConfig, BackgroundStyle, FooterIcons } from "@/components/creator/ThemeTypes";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditThemePage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.id as string;
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [themeName, setThemeName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
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
                    toast.error("Theme not found");
                    router.push("/designer/dashboard/themes");
                }
            } catch (error) {
                console.error("Error fetching theme:", error);
                toast.error("Failed to load theme");
                router.push("/designer/dashboard/themes");
            } finally {
                setIsLoading(false);
            }
        }
        if (themeId) {
            fetchTheme();
        }
    }, [themeId, router]);

    const updateConfig = (key: keyof ThemeConfig, value: BackgroundStyle | string | FooterIcons) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveTheme = async () => {
        if (!themeName.trim()) {
            toast.error("Please enter a theme name");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/designer/themes/${themeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: themeName,
                    config: config,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Theme updated successfully!");
                router.push("/designer/dashboard/themes");
            } else {
                toast.error(data.error || "Failed to update theme. Please try again.");
            }
        } catch (error) {
            console.error("Error updating theme:", error);
            toast.error("An error occurred while updating the theme.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
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
                    <h1 className="text-3xl font-bold mb-2">Edit Theme</h1>
                    <p className="text-muted-foreground">Update your theme design and settings</p>
                </div>
            </div>

            {/* Theme Name Input */}
            <Card>
                <CardHeader>
                    <CardTitle>Theme Name</CardTitle>
                    <CardDescription>Enter a name for your theme</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="themeName">Theme Name *</Label>
                        <Input
                            id="themeName"
                            type="text"
                            value={themeName}
                            onChange={(e) => setThemeName(e.target.value)}
                            placeholder="Enter theme name (e.g., Romantic Rose, Elegant Gold)"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Theme Creator */}
            <Card>
                <CardHeader>
                    <CardTitle>Theme Designer</CardTitle>
                    <CardDescription>Customize your theme appearance</CardDescription>
                </CardHeader>
                <CardContent>
                    <main className="flex justify-center">
                        <CreatorCard config={config} updateConfig={updateConfig} />
                    </main>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <Link href="/designer/dashboard/themes">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                    variant="secondary"
                    onClick={() => {
                        console.log("Current Configuration:", JSON.stringify(config, null, 2));
                        toast.info("Theme config logged to console!");
                    }}
                >
                    Preview JSON
                </Button>
                <Button
                    onClick={handleSaveTheme}
                    disabled={isSaving || !themeName.trim()}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}

