import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { HatchPage } from '@/pages/hatch/HatchPage'
import { GamePage } from '@/pages/game/GamePage'
import { MinigamePage } from '@/pages/game/MinigamePage'
import { DungeonSelectPage } from '@/pages/dungeon/DungeonSelectPage'
import { DungeonBattlePage } from '@/pages/dungeon/DungeonBattlePage'
import { InventoryPage } from '@/pages/inventory/InventoryPage'
import { TutorialPage } from '@/pages/tutorial/TutorialPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/tutorial',
    element: (
      <ProtectedRoute>
        <TutorialPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hatch',
    element: (
      <ProtectedRoute>
        <HatchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/game',
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/minigame',
    element: (
      <ProtectedRoute>
        <MinigamePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dungeon',
    element: (
      <ProtectedRoute>
        <DungeonSelectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dungeon/battle',
    element: (
      <ProtectedRoute>
        <DungeonBattlePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
  },
])
