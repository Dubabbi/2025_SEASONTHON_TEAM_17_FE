import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Layout = lazy(() => import('@layouts/layout'));

const MainPage = lazy(() => import('@pages/main/main-page'));
const LoginPage = lazy(() => import('@pages/login/login-page'));

const DiaryPage = lazy(() => import('@pages/diary/diary-page'));
const DiaryCreatePage = lazy(() => import('@pages/diary/diary-create-page'));
const DiaryRecordPage = lazy(() => import('@pages/diary/diary-record-page'));

const MyPage = lazy(() => import('@pages/my-page/my-page'));
const TermsServicePage = lazy(() => import('@pages/my-page/terms-service-page'));

const NotificationsPage = lazy(() => import('@pages/notifications/notifications-page'));

const NotFound = lazy(() => import('@pages/error/not-found'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },

      { path: '/login', element: <LoginPage /> },

      {
        path: '/diary',
        children: [
          { index: true, element: <DiaryPage /> },
          { path: 'create', element: <DiaryCreatePage /> },
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
    ],
  },
]);
