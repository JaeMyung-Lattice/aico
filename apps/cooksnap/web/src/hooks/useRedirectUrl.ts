import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

// 로그인하지 않은 사용자를 메인 페이지로 리다이렉트
const useRedirectUrl = () => {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/', { replace: true })
    }
  }, [user, isLoading, navigate])

  return { isAuthenticated: !!user, isLoading }
}

export default useRedirectUrl
