
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

export async function POST(request: Request) {
      const supabase = await createClient()
      await supabase.auth.signOut()

      const origin = new URL(request.url).origin
      return NextResponse.redirect(`${origin}/`, { status: 303 })
}

//   If you add this, also change context / AuthContext.tsx: 263 - 272 to:

const signOut = async () => {
      try {
            const response = await fetch('/api/auth/signout', {
                  method: 'POST',
                  redirect: 'manual',
            })
            // Route handler does a 303 redirect. With `redirect: 'manual'` we just navigate.
            window.location.href = '/'
            if (response.type === 'opaqueredirect') {
                  // expected — server redirected, we navigate manually
            }
      } catch (err) {
            console.error('[AuthContext] signOut error:', err)
            toast.error('Sign out failed. Please try again.')
      }
}