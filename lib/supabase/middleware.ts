import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth")

  // Not logged in
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Logged in
  if (user) {
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const allowedRoles = ["admin", "super_admin"]

    const isAdmin =
      !error &&
      profile &&
      allowedRoles.includes(profile.role)

    // Non-admin trying dashboard
    if (isDashboardRoute && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    // Admin visiting login page
    if (isAuthPage && isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}