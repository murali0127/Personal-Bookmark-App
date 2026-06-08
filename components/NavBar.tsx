'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TabGroup, TabList, Tab } from '@headlessui/react'
import { useState, useEffect, useEffectEvent } from 'react'
import { FolderBookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {toast} from "sonner";

const navigation = [
      {
            name: 'Home',
            href: '/',
      },
      {
            name: 'Dashboard',
            href: '/dashboard',
      },
      {
            name: 'Profile',
            href: '/profile',
      },
]

export default function Header() {
      const pathname = usePathname()
      const [profile, setProfile] = useState<{ user_name?: string | null; user_email?: string | null } | null>(null)
      const [isLoading, setIsLoading] = useState(true)
      const supabase = createClient()

      useEffect(() => {
            const fetchProfile = async () => {
                  const { data: { session } } = await supabase.auth.getSession()
                  if (!session) {
                        setProfile(null)
                        setIsLoading(false)
                        return
                  }

                  // console.log("User Session :", session);

                  const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('auth_user_id', session.user.id)
                        .single()

                  setProfile(data);
                  console.log('User data:', data);
                  if(error){
                        toast.error('Cannot Find user.')
                  }
                  setIsLoading(false)
            }

            fetchProfile();

            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                  if (session) {
                        fetchProfile()
                  } else {
                        setProfile(null)
                  }
            })

            return () => {
                  subscription.unsubscribe()
            }
      }, [])

      useEffect(() => {
            console.log('User : ', profile);
      }, [profile]);

      const activeIndex = navigation.findIndex(
            (item) => item.href === pathname
      )


      return (

            <header className="w-full py-6 fixed top-0 left-0 z-50">
                  <div className="flex justify-center">
                        <div className="rounded-full border border-zinc-200/10 bg-zinc-800/10 backdrop-blur-md p-1 shadow-2xl">
                              {profile ?
                                    <TabGroup selectedIndex={activeIndex >= 0 ? activeIndex : 0}>
                                          <TabList className="flex gap-1">
                                                {navigation.map((item) => (
                                                      <Tab
                                                            key={item.name}
                                                            as={Link}
                                                            href={item.href}
                                                            className={({ selected }) =>
                                                                  `
                    rounded-full px-5 py-2
                    text-xs font-bold uppercase tracking-wider
                    transition-all duration-200
                    outline-none

                    ${selected
                                                                        ? 'bg-white text-black shadow-md'
                                                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                                                  }
                  `
                                                            }
                                                      >
                                                            {item.name}
                                                      </Tab>
                                                ))}
                                          </TabList>
                                    </TabGroup>
                                    :
                                    <div className='navbar flex items-center gap-3 px-6 py-2'>
                                          <div className='p-1.5 rounded-lg bg-zinc-800/50 border border-white/5'>
                                                <FolderBookmark className='w-4 h-4 text-blue-500' />
                                          </div>
                                          <div className='text-xs text-white font-bold uppercase tracking-widest'>
                                                BOOKMARK VAULT
                                          </div>
                                    </div>
                              }

                        </div>
                  </div>
            </header>
      )
}
