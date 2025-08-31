import Header, { type HeaderProps } from '@layouts/header-bar';
import NavigationBar from '@layouts/nav-bar';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

const ROUTE_HEADERS: Array<{
  test: (p: string) => boolean;
  props: HeaderProps;
}> = [
  { test: (p) => p === '/', props: { variant: 'home', showDivider: true } },
  {
    test: (p) => p.startsWith('/diary/create'),
    props: { variant: 'title', title: '감정 일기 작성하기' },
  },
  {
    test: (p) => p.startsWith('/diary/record'),
    props: { variant: 'title', title: '나의 감정 일기 기록' },
  },
  {
    test: (p) => p.startsWith('/mypage/terms-service'),
    props: { variant: 'title', title: '서비스 이용약관' },
  },
  {
    test: (p) => p.startsWith('/notifications'),
    props: { variant: 'title', title: '알림' },
  },
];

function pickHeader(pathname: string): HeaderProps | null {
  return ROUTE_HEADERS.find((r) => r.test(pathname))?.props ?? null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const headerProps = pickHeader(pathname);

  return (
    <div className="flex max-h-dvh flex-col overflow-hidden">
      {headerProps && <Header {...headerProps} />}

      <main className="scrollbar-hide mx-auto min-h-dvh w-full flex-1 overflow-y-auto">
        <ScrollRestoration />
        <Outlet />
      </main>
      <NavigationBar />
    </div>
  );
}
