import { createClient } from '@/lib/supabase/server';


export async function getUserProfile(
      userId: string
) {

      const supabase = await createClient();
      const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

      return data;

      if (error) throw error;
}