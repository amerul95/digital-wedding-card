"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Palette,
  ShoppingBag,
  UsersRound,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Themes",
    url: "/admin/dashboard/themes",
    icon: Palette,
  },
  {
    title: "Orders",
    url: "/admin/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Designers",
    url: "/admin/dashboard/designers",
    icon: UsersRound,
  },
  {
    title: "Payments",
    url: "/admin/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-2 py-1.5">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/admin/dashboard" && pathname?.startsWith(item.url))
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
                  await fetch("/api/auth/admin/logout", { method: "POST" })
                  window.location.href = "/admin/login"
                } catch (error) {
                  console.error("Logout error:", error)
                  // Still redirect even if API call fails
                  window.location.href = "/admin/login"
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

