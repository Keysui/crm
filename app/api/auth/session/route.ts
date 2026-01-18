import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Try to get user from database
    const { data: user, error } = await db
      .from("users")
      .select("id, email, role, business_name, email_verified")
      .eq("id", session.userId)
      .single()

    // If database query fails or user not found, use JWT session data as fallback
    if (error || !user) {
      console.error("Session API - Database error:", error)
      // Fallback to JWT session data
      return NextResponse.json({
        user: {
          id: session.userId,
          email: session.email || null,
          role: session.role || "user",
          businessName: null,
          emailVerified: false,
        },
      })
    }

    // Return user data from database (preferred source)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email || session.email || null,
        role: user.role || session.role || "user",
        businessName: user.business_name || null,
        emailVerified: user.email_verified || false,
      },
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(
      { error: "Failed to get session", user: null },
      { status: 500 }
    )
  }
}
