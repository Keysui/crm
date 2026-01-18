"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Mail, Building2, Shield, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  businessName?: string
  emailVerified?: boolean
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        toast.success("Logged out successfully")
        router.push("/login")
        router.refresh()
      } else {
        toast.error("Failed to logout")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLogoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="space-y-1.5">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1f2937] leading-tight">Account</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        {/* User Information Card */}
        <Card className="border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-5 pt-6 px-6">
            <CardTitle className="text-xl font-semibold text-[#1f2937] leading-tight mb-1.5">Profile Information</CardTitle>
            <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
              Your account details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200/80">
              <Avatar className="h-20 w-20 ring-2 ring-gray-200/80 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white text-2xl font-semibold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#1f2937] mb-1 leading-tight">
                  {user?.businessName || "User Account"}
                </h3>
                <p className="text-base font-medium text-[#6b7280] leading-relaxed">{user?.email || "No email address"}</p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors border border-transparent hover:border-gray-200/50">
                <Mail className="h-5 w-5 text-[#6b7280] mt-0.5 shrink-0 stroke-[2.5]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-[#1f2937] leading-tight">{user?.email || "Not available"}</p>
                </div>
              </div>

              {user?.businessName && (
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors border border-transparent hover:border-gray-200/50">
                  <Building2 className="h-5 w-5 text-[#6b7280] mt-0.5 shrink-0 stroke-[2.5]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                      Business Name
                    </p>
                    <p className="text-sm font-semibold text-[#1f2937] leading-tight">{user.businessName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors border border-transparent hover:border-gray-200/50">
                <Shield className="h-5 w-5 text-[#6b7280] mt-0.5 shrink-0 stroke-[2.5]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                    Account Role
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {user?.role || "user"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors border border-transparent hover:border-gray-200/50">
                {user?.emailVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-[#10b981] mt-0.5 shrink-0 stroke-[2.5]" />
                ) : (
                  <XCircle className="h-5 w-5 text-[#f59e0b] mt-0.5 shrink-0 stroke-[2.5]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                    Email Verification
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user?.emailVerified ? "default" : "secondary"}
                      className="font-semibold text-xs"
                    >
                      {user?.emailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 h-fit">
          <CardHeader className="pb-5 pt-6 px-6">
            <CardTitle className="text-xl font-semibold text-[#1f2937] leading-tight mb-1.5">Account Actions</CardTitle>
            <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
              Manage your account session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="destructive"
              className="w-full h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              {logoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4 stroke-[2.5]" />
                  Log out
                </>
              )}
            </Button>
            <p className="text-xs text-[#9ca3af] text-center pt-1 leading-relaxed">
              You will be redirected to the login page after logging out
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
