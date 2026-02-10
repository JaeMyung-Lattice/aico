import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/home/HomePage'
import ResultPage from '@/pages/result/ResultPage'
import AuthPage from '@/pages/auth/AuthPage'
import MyPage from '@/pages/mypage/MyPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/result/:id', element: <ResultPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
])
