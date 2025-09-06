import { entryAuthGuard } from '@routes/auth-guard';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Layout = lazy(() => import('@layouts/layout'));
const MainPage = lazy(() => import('@pages/main/main-page'));
const OnboardingPage = lazy(() => import('@pages/onboarding/onboarding-page'));
const FriendsPage = lazy(() => import('@pages/friends/friends-page'));
const FriendDetailPage = lazy(() => import('@pages/friends/friend-detail-page'));
const FriendsMorePage = lazy(() => import('@pages/friends/friends-more-page'));
const LoginPage = lazy(() => import('@pages/login/login-page'));
const DiaryPage = lazy(() => import('@pages/diary/diary-page'));
const DiaryCreatePage = lazy(() => import('@pages/diary/diary-create-page'));
const DiaryResultPage = lazy(() => import('@pages/diary/diary-result-page'));
const DiaryRecordPage = lazy(() => import('@pages/diary/diary-record-page'));
const MyPage = lazy(() => import('@pages/my-page/my-page'));
const TermsServicePage = lazy(() => import('@pages/my-page/terms-service-page'));
const NotificationsPage = lazy(() => import('@pages/notifications/notifications-page'));
const NotFound = lazy(() => import('@pages/error/not-found'));
const FriendDiaryPage = lazy(() => import('@pages/friends/friend-diary-page'));

import KakaoCallbackPage from '@pages/login/kakao-callback-page';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: entryAuthGuard,
    shouldRevalidate: () => false,
    children: [
      { index: true, element: <MainPage /> },
      { path: '/login', element: <LoginPage />, handle: { hideChrome: true } },
      { path: '/login/callback', element: <KakaoCallbackPage /> },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
        handle: { hideChrome: true },
      },
      {
        path: '/diary',
        children: [
          { index: true, element: <DiaryPage /> },
          { path: 'create', element: <DiaryCreatePage /> },
          { path: 'result', element: <DiaryResultPage /> },
          { path: 'record', element: <DiaryRecordPage /> },
        ],
      },

      {
        path: '/mypage',
        children: [
          { index: true, element: <MyPage /> },
          { path: 'terms-service', element: <TermsServicePage /> },
        ],
      },

      { path: '/notifications', element: <NotificationsPage /> },

      { path: '*', element: <NotFound />, handle: { hideChrome: true } },

      {
        path: '/friends',
        children: [
          { index: true, element: <FriendsPage /> },
          { path: 'all', element: <FriendsMorePage /> },
          { path: ':id', element: <FriendDetailPage /> },
          { path: ':id/diary/:diaryId', element: <FriendDiaryPage /> },
        ],
      },
    ],
  },
]);
