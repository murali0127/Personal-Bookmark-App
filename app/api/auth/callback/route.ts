import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function errorRedirect(origin: string, reason: string) {
      return NextResponse.redirect(
            `${origin}/auth/auth-error?reason=${encodeURIComponent(reason)}`
      )
}

export async function GET(request: Request) {
      const { searchParams, origin } = new URL(request.url)
      const code = searchParams.get('code')

      // Only accept same-origin paths to prevent open-redirects.
      // Falls back to '/home' for any value that doesn't start with '/'.
      const rawNext = searchParams.get('next') ?? '/home'
      const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/home'

      // Supabase (or the IdP) can append an error description on the callback URL.
      // Surface it on the error page instead of a generic "something went wrong".
      const errorParam =
            searchParams.get('error_description') ||
            searchParams.get('error')

      if (errorParam) {
            return errorRedirect(origin, errorParam)
      }

      if (code) {
            const supabase = await createClient()
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                  return NextResponse.redirect(`${origin}${next}`)
            }
            return errorRedirect(origin, error.message)
      }

      return errorRedirect(origin, 'missing_code')
}
