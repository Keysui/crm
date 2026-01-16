import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyJWT } from "./auth"

const COOKIE_NAME = "auth-token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifyJWT(token)
}

export async function setSession(
  token: string,
  rememberMe: boolean = false
): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  const expiresAt = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000)

  response.cookies.set(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  })

  return response
}

export async function clearSession(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}

export function setSessionInResponse(
  response: NextResponse,
  token: string,
  rememberMe: boolean = false
): NextResponse {
  const expiresAt = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000)

  response.cookies.set(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  })

  return response
}

export function clearSessionInResponse(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME)
  return response
}
