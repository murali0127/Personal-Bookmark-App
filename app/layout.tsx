import './globals.css';
import type { Metadata, Viewport } from 'next';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarksProvider } from '@/context/BookmarkContext';
import Header from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Bookmark Vault',
  description: 'come get Organize your Bookmarks.',
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-[#e4e2e4] antialiased min-h-screen flex flex-col">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex-1 flex flex-col min-h-0">
            <AuthProvider>
              <BookmarksProvider>
                <Header />
                <main className="flex-1 pt-20 md:pt-28">
                  {children}
                </main>
              </BookmarksProvider>
            </AuthProvider>
          </div>
        </ErrorBoundary>
        <Toast />
        <Footer />
      </body>
    </html>
  );
}
