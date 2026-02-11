import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import classnames from 'classnames/bind'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { Loading } from '@repo/ui'
import PremiumModal from '@/components/PremiumModal'
import type { SavedRecipe, AnalysisHistoryItem } from '@/types/user'
import styles from './MyPage.module.scss'

const cx = classnames.bind(styles)

type Tab = 'saved' | 'history'

const MyPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('saved')
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const { data: savedRecipes = [], isLoading: isSavedLoading } = useQuery<SavedRecipe[]>({
    queryKey: ['my-recipes'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/recipes')
      return data
    },
  })

  const { data: history = [], isLoading: isHistoryLoading } = useQuery<AnalysisHistoryItem[]>({
    queryKey: ['my-history'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/history')
      return data
    },
  })

  const isLoading = isSavedLoading || isHistoryLoading

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/result/${recipeId}`)
  }

  if (isLoading) {
    return <Loading message="데이터를 불러오는 중..." />
  }

  return (
    <div className={cx('mypage')}>
      <div className={cx('pageHeader')}>
        <h1 className={cx('title')}>마이페이지</h1>
        {user?.isPremium ? (
          <span className={cx('premiumBadge')}>Premium</span>
        ) : (
          <button
            className={cx('upgradeButton')}
            onClick={() => setShowPremiumModal(true)}
          >
            Premium 구독하기
          </button>
        )}
      </div>

      <div className={cx('tabs')}>
        <button
          className={cx('tab', { active: activeTab === 'saved' })}
          onClick={() => setActiveTab('saved')}
        >
          저장된 레시피
        </button>
        <button
          className={cx('tab', { active: activeTab === 'history' })}
          onClick={() => setActiveTab('history')}
        >
          분석 히스토리
        </button>
      </div>

      {activeTab === 'saved' && (
        <div className={cx('grid')}>
          {savedRecipes.length === 0 ? (
            <div className={cx('empty')}>저장된 레시피가 없습니다.</div>
          ) : (
            savedRecipes.map((item) => (
              <div
                key={item.id}
                className={cx('recipeCard')}
                onClick={() => handleRecipeClick(item.recipeId)}
              >
                {item.recipe.thumbnailUrl && (
                  <img
                    className={cx('cardThumbnail')}
                    src={item.recipe.thumbnailUrl}
                    alt={item.recipe.title}
                  />
                )}
                <div className={cx('cardBody')}>
                  <p className={cx('cardTitle')}>{item.recipe.title}</p>
                  {item.recipe.totalPrice && (
                    <p className={cx('cardPrice')}>
                      {item.recipe.totalPrice.toLocaleString()}원
                    </p>
                  )}
                  <p className={cx('cardDate')}>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className={cx('historyList')}>
          {history.length === 0 ? (
            <div className={cx('empty')}>분석 히스토리가 없습니다.</div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={cx('historyItem')}
              >
                <div className={cx('historyInfo')}>
                  <p className={cx('historyTitle')}>{item.recipe.title}</p>
                  {user?.isPremium && (
                    <p className={cx('historyUrl')}>{item.videoUrl}</p>
                  )}
                </div>
                <span className={cx('historyDate')}>
                  {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  )
}

export default MyPage
