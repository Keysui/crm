import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const { data: user, error } = await db
    .from("users")
    .select("id, email, role, business_name, email_verified")
    .eq("id", session.userId)
    .single()

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      businessName: user.business_name,
      emailVerified: user.email_verified,
    },
  })
}
