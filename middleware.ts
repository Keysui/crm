import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const token = request.cookies.get("auth-token")?.value

    const isDashboardPath = pathname.startsWith("/dashboard")
    const isLoginPath = pathname === "/login"
    const isPublicPath =
      pathname === "/login" ||
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/reset-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/webhooks")

    if (isPublicPath) {
      if (isLoginPath && token) {
        try {
          const session = await verifyJWT(token)
          if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
          }
        } catch {
          // Invalid token, continue to login page
        }
      }
      return NextResponse.next()
    }

    if (isDashboardPath) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      try {
        const session = await verifyJWT(token)
        if (!session) {
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("auth-token")
          return response
        }
      } catch {
        // Invalid token, redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth-token")
        return response
      }

      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    // If middleware fails, redirect to login to prevent blank screen
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
