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
  title: {
    default: 'Bookmark Vault | Organize your bookmarks beautifully',
    template: '%s | Bookmark Vault',
  },
  description:
    'Bookmark Vault helps you save, organize, and revisit articles, inspiration, and research in a polished personal workspace.',
  keywords: [
    'bookmark manager',
    'save links',
    'organize bookmarks',
    'personal bookmark app',
    'bookmark organizer',
  ],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Bookmark Vault | Organize your bookmarks beautifully',
    description:
      'A modern bookmark manager for organizing articles, references, and inspiration in one beautiful workspace.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bookmark Vault',
    url: '/',
    images: [{ url: '/icon.svg', width: 512, height: 512, alt: 'Bookmark Vault logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bookmark Vault | Organize your bookmarks beautifully',
    description:
      'A modern bookmark manager for organizing articles, references, and inspiration in one beautiful workspace.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
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
