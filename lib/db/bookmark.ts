import { createClient } from '@/lib/supabase/server'

export async function getBookmarksForOwner(ownerId: string) {
      const supabase = await createClient()
      const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', ownerId)
            .order('created_at', { ascending: false })
      if (error) throw error
      return data
}

export async function getPublicBookmarksByHandle(handle: string) {
      const supabase = await createClient()
      const { data, error } = await supabase
            .from('profiles')
            .select('id, user_name, bookmarks!inner(title, url, visibility)')
            .eq('handle', handle)
            .eq('bookmarks.visibility', 'public')
            .single()
      if (error) throw error
      return data
}