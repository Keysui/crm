"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings } from "lucide-react"
import { Breadcrumbs } from "./breadcrumbs"
import { toast } from "sonner"

export function Topbar() {
  const router = useRouter()
  const [user, setUser] = useState<{
    email: string
    businessName?: string
  } | null>(null)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Logged out successfully")
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover:bg-[#f9fafb] transition-all duration-200 p-0"
            >
              <Avatar className="h-9 w-9 ring-2 ring-gray-200/80 hover:ring-[#00C6FF]/30 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border border-gray-200/80 shadow-lg bg-white/98 backdrop-blur-xl rounded-xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal px-3.5 py-3">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold leading-tight text-[#1f2937]">
                  {user?.businessName || "User"}
                </p>
                <p className="text-xs leading-tight text-[#6b7280]">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200/80" />
            <DropdownMenuItem 
              onClick={() => router.push("/dashboard/account")}
              className="cursor-pointer transition-colors px-3.5 py-2.5"
            >
              <User className="mr-2.5 h-4 w-4 text-[#6b7280] stroke-[2.5]" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push("/dashboard/account")}
              className="cursor-pointer transition-colors px-3.5 py-2.5"
            >
              <Settings className="mr-2.5 h-4 w-4 text-[#6b7280] stroke-[2.5]" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200/80" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-[#ef4444] focus:text-[#dc2626] transition-colors px-3.5 py-2.5"
            >
              <LogOut className="mr-2.5 h-4 w-4 stroke-[2.5]" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
