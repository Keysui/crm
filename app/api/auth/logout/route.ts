import { NextResponse } from "next/server"
import { clearSessionInResponse } from "@/lib/session"

export async function POST() {
  const response = NextResponse.json({ success: true })
  return clearSessionInResponse(response)
}
