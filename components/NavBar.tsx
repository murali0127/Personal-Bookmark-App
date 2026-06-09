'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TabGroup, TabList, Tab } from '@headlessui/react'
import { FolderBookmark } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
      const { user, profile } = useAuth();


      if (pathname === '/') {
            return (
                  <header className="w-full py-6 fixed top-0 left-0 z-50">
                        <div className="flex justify-center">
                              <div className="rounded-full border border-zinc-200/40 bg-black/10 p-1 shadow-2xl">
                                    <div className='navbar flex items-center gap-3 px-6 py-2'>
                                          <div className='p-1.5 rounded-lg bg-zinc-800/50 border border-white/5'>
                                                <FolderBookmark className='w-4 h-4 text-blue-500' />
                                          </div>
                                          <div className='text-xs text-white font-bold uppercase tracking-widest'>
                                                BOOKMARK VAULT
                                          </div>
                                    </div>
                              </div>
                        </div>

                  </header >
            );
      }

      const activeIndex = navigation.findIndex(
            (item) => item.href === pathname
      )

      return (
            <header className="w-full py-6 fixed top-0 left-0 z-50">
                  <div className="flex justify-center">
                        <div className="rounded-full border border-zinc-200/40 bg-black/10 p-1 shadow-2xl">
                              {user?.aud === 'authenticated' ? (
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
                              ) : (
                                    <div className='navbar flex items-center gap-3 px-6 py-2'>
                                          <div className='p-1.5 rounded-lg bg-zinc-800/50 border border-white/5'>
                                                <FolderBookmark className='w-4 h-4 text-blue-500' />
                                          </div>
                                          <div className='text-xs text-white font-bold uppercase tracking-widest'>
                                                BOOKMARK VAULT
                                          </div>
                                    </div>
                              )}
                        </div>
                  </div>
            </header>
      )
}
