import { supabase } from '@/lib/supabase'
import { comparePassword, createJWT, createLongLivedJWT } from '@/lib/auth'
import { setSessionInResponse } from '@/lib/session'
import { loginRateLimit } from '@/lib/ratelimit'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    let rateLimitResult
    try {
      rateLimitResult = await loginRateLimit.limit(ip)
    } catch (rateLimitError) {
      console.error('Rate limit error:', rateLimitError)
      rateLimitResult = { success: true }
    }
    const success = rateLimitResult.success !== false

    if (!success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get user from Supabase
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (dbError || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check account lockout
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.lock_until).getTime() - Date.now()) / 60000
      )
      return NextResponse.json(
        {
          error: `Account locked. Try again in ${minutesLeft} minute${
            minutesLeft !== 1 ? 's' : ''
          }.`,
        },
        { status: 423 }
      )
    }

    // Verify password
    const valid = await comparePassword(password, user.password)
    if (!valid) {
      // Increment failed login count
      const failedCount = (user.failed_login_count || 0) + 1
      const lockUntil =
        failedCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null

      await supabase
        .from('users')
        .update({
          failed_login_count: failedCount,
          lock_until: lockUntil,
        })
        .eq('id', user.id)

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Reset failed login count on success
    await supabase
      .from('users')
      .update({
        failed_login_count: 0,
        lock_until: null,
      })
      .eq('id', user.id)

    // Create JWT token
    const token = rememberMe
      ? await createLongLivedJWT({
          userId: user.id,
          email: user.email,
          role: user.role || 'user',
        })
      : await createJWT({
          userId: user.id,
          email: user.email,
          role: user.role || 'user',
        })

    // Set session cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        businessName: user.business_name,
      },
    })

    return setSessionInResponse(response, token, rememberMe)
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}
