
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function AuthErrorContent() {
      const searchParams = useSearchParams();
      const reason =
            searchParams.get('reason') ?? 'Something went wrong during sign-in.';

      return (
            <div className="min-h-[60vh] flex items-center justify-center px-4" >
                  <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl bg-white/[0.03] border border-white/10" >
                        <h1 className="text-white text-2xl font-bold tracking-tight" >
                              Sign -in failed
                        </h1>
                        < p className="text-white/60 text-sm leading-relaxed" > {reason} </p>
                        < div className="flex gap-3 justify-center pt-2" >
                              <Link
                                    href="/"
                                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-semibold transition - colors"
                              >
                                    Back to sign in
                              </Link>
                        </div>
                  </div>
            </div>
      );
}

export default function AuthErrorPage() {
      return (
            <Suspense fallback={< div className="min-h-[60vh]" />}>
                  <AuthErrorContent />
            </Suspense>
      );
}
