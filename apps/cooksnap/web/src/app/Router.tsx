import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import HomePage from '@/pages/home/HomePage'
import ResultPage from '@/pages/result/ResultPage'
import AuthPage from '@/pages/auth/AuthPage'
import MyPage from '@/pages/mypage/MyPage'
import ErrorPage from '@/pages/error/ErrorPage'
import NotFoundPage from '@/pages/error/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/result/:id', element: <ResultPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/mypage', element: <MyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
