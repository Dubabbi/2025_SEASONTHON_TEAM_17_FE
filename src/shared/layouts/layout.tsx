import { Outlet, ScrollRestoration } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex max-h-dvh flex-col overflow-hidden">
      <main className="scrollbar-hide mx-auto min-h-dvh w-full flex-1 overflow-y-auto">
        <ScrollRestoration />
        <Outlet />
      </main>
    </div>
  );
}
