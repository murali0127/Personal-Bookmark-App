import { createClient } from '@/lib/supabase/server';


export async function getUserProfile() {
      const supabase = await createClient();

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return null

      const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', user.id)
            .single()

      if (error) throw error
      return data
}


// Get a profile by handle (for public page)
export async function getProfileByHandle(handle: string) {
      const supabase = await createClient();

      const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('handle', handle)
            .single()

      if (error) return null
      return data
}

export async function updateProfile(profile: { user_name?: string | ""; handle?: string | "" }) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
            .from('profiles')
            .update(profile as any)
            .eq('auth_user_id', user.id)
            .select()
            .single()

      if (error) throw error
      return data
}