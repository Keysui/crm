"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          router.push("/dashboard")
        }
      } catch {
        // Ignore
      }
    }
    checkSession()
  }, [router])

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || "Login failed"
        const details = data.details ? `: ${data.details}` : ""
        toast.error(errorMsg + details)
        return
      }

      toast.success("Login successful")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9fafb] via-white to-[#f3f4f6] px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border border-gray-200/80 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 pt-8 px-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center shadow-md">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-center font-display text-[#1f2937] leading-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-sm text-[#6b7280] leading-relaxed">
                Sign in to continue to your CRM dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#1f2937]">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-[#00C6FF]/20 border-gray-200/80"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-xs text-[#ef4444] animate-in fade-in slide-in-from-top-1 leading-tight mt-1"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#1f2937]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-[#00C6FF]/20 border-gray-200/80"
                />
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-xs text-[#ef4444] animate-in fade-in slide-in-from-top-1 leading-tight mt-1"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex items-center space-x-2.5">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    disabled={loading}
                    className="transition-all"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer text-[#6b7280] hover:text-[#1f2937] transition-colors leading-tight"
                  >
                    Remember me
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold btn-gradient text-white shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
