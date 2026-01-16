"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Zap,
  Brain,
  User as UserIcon,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Leads (CRM)", href: "/dashboard/leads", icon: Users },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "AI Settings", href: "/dashboard/ai-settings", icon: Brain },
  { name: "Account", href: "/dashboard/account", icon: UserIcon },
]

const SidebarContent = ({ pathname }: { pathname: string }) => (
  <>
    <div className="flex h-16 items-center border-b px-6">
      <h2 className="text-lg font-semibold">CRM Dashboard</h2>
    </div>
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  </>
)

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r bg-background">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
