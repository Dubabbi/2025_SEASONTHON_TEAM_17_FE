import Header, { type HeaderProps } from '@layouts/header-bar';
import NavigationBar from '@layouts/nav-bar';
import Splash from '@layouts/splash';
import { useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches, useNavigate } from 'react-router-dom';

const EXCEPTION_HEADERS: Array<{
  test: (p: string) => boolean;
  props: HeaderProps;
}> = [
  {
    test: (p) => p.startsWith('/diary/create'),
    props: { variant: 'title', title: '감정 일기 작성하기' },
  },
  {
    test: (p) => p.startsWith('/diary/result'),
    props: { variant: 'title', title: '감정 일기 작성하기' },
  },
  {
    test: (p) => p.startsWith('/diary/record'),
    props: { variant: 'title', title: '나의 감정 일기 전체 기록' },
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

const DEFAULT_HEADER: HeaderProps = { variant: 'home', showDivider: true };

type FriendNavState = {
  nickname?: string;
  email?: string;
  profileImageUrl?: string | null;
  avatarUrl?: string | null;
  isFriend?: boolean;
  isRequested?: boolean;
};

function pickHeader(pathname: string, search: string, state?: unknown): HeaderProps {
  if (pathname === '/friends/all') {
    const tab = new URLSearchParams(search).get('tab');
    const title =
      tab === 'sent'
        ? '요청한 친구 목록'
        : tab === 'received'
          ? '요청받은 친구 목록'
          : '내 친구 목록';
    return { variant: 'title', title };
  }

  const diaryDate = pathname.match(/^\/friends\/([^/]+)\/diary\/(\d{4}-\d{2}-\d{2})$/);
  if (diaryDate) {
    const s = (state ?? {}) as FriendNavState;
    const name = s.nickname ?? '친구';
    return { variant: 'title', title: name };
  }

  const diaryById = pathname.match(/^\/friends\/([^/]+)\/diary\/([^/]+)$/);
  if (diaryById) {
    const s = (state ?? {}) as FriendNavState;
    const name = s.nickname ?? '친구';
    return { variant: 'title', title: name };
  }

  const friend = pathname.match(/^\/friends\/([^/]+)$/);
  if (friend) {
    const s = (state ?? {}) as FriendNavState;
    const name = s.nickname ?? '친구';
    return { variant: 'title', title: name };
  }

  return EXCEPTION_HEADERS.find((r) => r.test(pathname))?.props ?? DEFAULT_HEADER;
}

export default function Layout() {
  const { pathname, search, state } = useLocation();
  const headerProps = pickHeader(pathname, search, state);
  const navigate = useNavigate();

  const matches = useMatches();
  type HandleShape = { hideChrome?: boolean };
  const last = matches[matches.length - 1] as { handle?: HandleShape } | undefined;
  const hideChrome = !!last?.handle?.hideChrome;

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashSeen'));
  const handleSplashDone = () => {
    sessionStorage.setItem('splashSeen', '1');
    setShowSplash(false);
  };

  if (showSplash) return <Splash onComplete={handleSplashDone} />;

  return (
    <div className="flex max-h-dvh flex-col overflow-hidden">
      {!hideChrome && <Header onBellClick={() => navigate('/notifications')} {...headerProps} />}

      <main className="scrollbar-hide mx-auto min-h-dvh w-full flex-1 overflow-y-auto">
        <ScrollRestoration />
        <Outlet />
      </main>

      {!hideChrome && <NavigationBar />}
    </div>
  );
}
