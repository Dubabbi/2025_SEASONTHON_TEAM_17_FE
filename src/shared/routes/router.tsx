import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Layout = lazy(() => import('@layouts/layout'));
const MainPage = lazy(() => import('@pages/main/main-page'));
const MyPage = lazy(() => import('@pages/my-page/my-page'));
const LoginPage = lazy(() => import('@pages/login/login-page'));
const RecordPage = lazy(() => import('@pages/record'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/record',
        element: <RecordPage />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
    ],
  },
]);
