import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/home/HomePage'
import RoomPage from '@/pages/room/RoomPage'
import GamePage from '@/pages/game/GamePage'
import ResultPage from '@/pages/result/ResultPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/room/:code',
    element: <RoomPage />,
  },
  {
    path: '/game/:code',
    element: <GamePage />,
  },
  {
    path: '/result/:code',
    element: <ResultPage />,
  },
])
