import FcmForeground from '@hooks/fcm-foreground';
import queryClient from '@libs/query-client';
import { router } from '@routes/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './shared/contexts/toast-context';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Suspense fallback={null}>
          <ToastProvider>
            <RouterProvider router={router} />
            <FcmForeground />
          </ToastProvider>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}
