import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
      let supabaseResponse = NextResponse.next({ request })

      const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                  cookies: {
                        getAll() {
                              return request.cookies.getAll()
                        },
                        setAll(cookiesToSet) {
                              // Must set on BOTH request and response so the session stays fresh
                              cookiesToSet.forEach(({ name, value }) =>
                                    request.cookies.set(name, value)
                              )
                              supabaseResponse = NextResponse.next({ request })
                              cookiesToSet.forEach(({ name, value, options }) =>
                                    supabaseResponse.cookies.set(name, value, options)
                              )
                        },
                  },
            }
      )
      //Get Auth data from Supabase.
      const { data: { user } } = await supabase.auth.getUser()

      // Protect dashboard routes
      const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/settings')

      if (!user && isProtectedRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
      }

      return supabaseResponse

};