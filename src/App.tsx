import queryClient from '@libs/query-client';
import { router } from '@routes/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { requestFCMToken } from './firebase/fcm';
import { ToastProvider } from './shared/contexts/toast-context';

export default function App() {
  useEffect(() => {
    requestFCMToken();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Suspense fallback={null}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}
