import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import Landing from '@/pages/Landing/Landing'
import Result from '@/pages/Result/Result'
import Auth from '@/pages/Auth/Auth'
import MyPage from '@/pages/MyPage/MyPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/result/:id', element: <Result /> },
      { path: '/auth', element: <Auth /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
])
