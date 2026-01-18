"use client"

import { useState, useEffect } from "react"
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
  SheetTitle,
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
    <div className="flex h-16 items-center border-b border-gray-200/80 px-6 bg-white">
      <h2 className="text-lg font-bold tracking-tight font-display gradient-text leading-tight">
        ScaleMako CRM
      </h2>
    </div>
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
              isActive
                ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-md shadow-[#00C6FF]/20"
                : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#1f2937]"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-0.5 rounded-r-full bg-white/40" />
            )}
            <item.icon
              className={cn(
                "h-4.5 w-4.5 transition-all duration-200 shrink-0",
                isActive
                  ? "text-white stroke-[2.5]"
                  : "text-[#9ca3af] group-hover:text-[#1f2937] stroke-[2.5]"
              )}
            />
            <span className="relative z-10 leading-tight">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  </>
)

export function Sidebar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r border-gray-200 bg-white">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <div className="lg:hidden">
        {isMounted ? (
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
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SidebarContent pathname={pathname} />
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            disabled
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>
    </>
  )
}
