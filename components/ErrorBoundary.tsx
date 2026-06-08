"use client";

import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { toast } from 'sonner';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<FallbackProps>;
};

export default function ErrorBoundary({
  children,
  FallbackComponent,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onReset={() => {
        // Reset the error boundary state
      }}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Show a toast with the error message
        toast.error('An unexpected error occurred', {
          description: error instanceof Error ? error.message : 'Something went wrong',
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}