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
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* User Information Card */}
        <Card className="border-0 shadow-lg hover-lift transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
            <CardDescription className="text-sm">
              Your account details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-semibold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {user?.businessName || "User Account"}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>

              {user?.businessName && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Business Name
                    </p>
                    <p className="text-sm font-medium">{user.businessName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Account Role
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      {user?.role || "user"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                {user?.emailVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Verification
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user?.emailVerified ? "default" : "secondary"}
                      className="font-medium"
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
        <Card className="border-0 shadow-lg hover-lift transition-all duration-300 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Account Actions</CardTitle>
            <CardDescription className="text-sm">
              Manage your account session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="destructive"
              className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {logoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              You will be redirected to the login page after logging out
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
