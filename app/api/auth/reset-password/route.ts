import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import {
  hashPassword,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from "@/lib/auth"
import { passwordResetRateLimit } from "@/lib/ratelimit"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, token, newPassword } = body

    if (token && newPassword) {
      const payload = await verifyPasswordResetToken(token)

      if (!payload) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        )
      }

      const hashedPassword = await hashPassword(newPassword)

      const { error } = await db
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", payload.userId)

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true })
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const rateLimitResult = await passwordResetRateLimit.limit(ip)
    const success = rateLimitResult.success !== false

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const { data: user } = await db
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (!user) {
      return NextResponse.json({ success: true })
    }

    const resetToken = await createPasswordResetToken({
      userId: user.id,
      email: user.email,
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 15 minutes.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
