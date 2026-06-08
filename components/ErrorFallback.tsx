"use client";

export default function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Something went wrong!
      </h2>
      <p className="text-white/80 mb-6 max-w-md text-center">
        {error instanceof Error ? error.message : 'An unknown error occurred'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}