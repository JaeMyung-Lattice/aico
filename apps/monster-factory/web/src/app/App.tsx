import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMonsterStore } from '@/stores/useMonsterStore'

const App = () => {
  const { initialize, user } = useAuthStore()
  const { fetchMonster } = useMonsterStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      fetchMonster()
    }
  }, [user, fetchMonster])

  return <RouterProvider router={router} />
}

export default App
