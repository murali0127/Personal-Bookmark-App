import './globals.css';
import type { Metadata, Viewport } from 'next';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

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
      <body className="bg-black text-[#e4e2e4] antialiased">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
        <Toast />
      </body>
      </html>
  );
}
