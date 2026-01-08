"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Plus,
  FileText,
  DollarSign,
  LogOut,
  Wallet,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/designer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Theme",
    url: "/designer/dashboard/create-theme",
    icon: Plus,
  },
  {
    title: "My Projects",
    url: "/designer/dashboard/themes",
    icon: FileText,
  },
  {
    title: "Earnings",
    url: "/designer/dashboard/earnings",
    icon: DollarSign,
  },
  {
    title: "Wallet",
    url: "/designer/dashboard/wallet",
    icon: Wallet,
  },
  {
    title: "Profile",
    url: "/designer/dashboard/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [designerName, setDesignerName] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchDesigner() {
      try {
        const response = await fetch("/api/designer/me")
        if (response.ok) {
          const data = await response.json()
          setDesignerName(data.name || null)
        }
      } catch (error) {
        console.error("Error fetching designer:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDesigner()
  }, [])

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return null
    return fullName.split(" ")[0]
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-2 py-1.5">
          <h2 className="text-lg font-semibold">Designer Dashboard</h2>
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : designerName ? (
            <p className="text-sm text-muted-foreground">{getFirstName(designerName)}</p>
          ) : null}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/designer/dashboard" && pathname?.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                try {
                  await fetch("/api/auth/designer/logout", { method: "POST" })
                  window.location.href = "/designer/login"
                } catch (error) {
                  console.error("Logout error:", error)
                  // Still redirect even if API call fails
                  window.location.href = "/designer/login"
                }
              }}
            >
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
