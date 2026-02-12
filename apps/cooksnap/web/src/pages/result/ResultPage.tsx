import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import classnames from 'classnames/bind'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { Loading } from '@repo/ui'
import useRedirectUrl from '@/hooks/useRedirectUrl'
import PremiumModal from '@/components/PremiumModal'
import type { Recipe, PurchaseLink } from '@/types/recipe'
import styles from './ResultPage.module.scss'

const cx = classnames.bind(styles)

const formatPrice = (price: number | null): string => {
  if (price === null) return '-'
  return `${price.toLocaleString()}원`
}

const Result = () => {
  const { isAuthenticated, isLoading: authLoading } = useRedirectUrl()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data } = await api.get(`/recipes/${id}`)
      return data
    },
    enabled: !!id && isAuthenticated,
  })

  // 403 (소유권 없음) 시 메인으로 이동
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error && (error as any)?.response?.status === 403) {
      navigate('/', { replace: true })
    }
  }, [error, navigate])

  // 저장 여부 확인 (프리미엄 로그인 사용자만)
  const { data: saveStatus } = useQuery<{ saved: boolean }>({
    queryKey: ['recipe-saved', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/me/recipes/${id}/saved`)
      return data
    },
    enabled: !!user?.isPremium && !!id,
  })

  const saveMutation = useMutation({
    mutationFn: () => api.post(`/users/me/recipes/${id}/save`),
    onSuccess: () => {
      queryClient.setQueryData(['recipe-saved', id], { saved: true })
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] })
    },
  })

  const unsaveMutation = useMutation({
    mutationFn: () => api.delete(`/users/me/recipes/${id}/save`),
    onSuccess: () => {
      queryClient.setQueryData(['recipe-saved', id], { saved: false })
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] })
    },
  })

  const handleToggleSave = () => {
    if (!user?.isPremium) {
      setShowPremiumModal(true)
      return
    }

    if (saveStatus?.saved) {
      unsaveMutation.mutate()
    } else {
      saveMutation.mutate()
    }
  }

  // 구매 링크 조회 (레시피 로딩 완료 후)
  const { data: purchaseLinks } = useQuery<PurchaseLink[]>({
    queryKey: ['purchaseLinks', id],
    queryFn: async () => {
      const { data } = await api.get(`/recipes/${id}/purchase-links`)
      return data
    },
    enabled: !!recipe,
  })

  // 재료별 구매 링크 매핑
  const getLinkForIngredient = (ingredientId: string): string | null => {
    if (!purchaseLinks) return null
    const link = purchaseLinks.find((l) => l.ingredientId === ingredientId)
    return link?.purchaseUrl || null
  }

  if (authLoading || !isAuthenticated || isLoading) {
    return <Loading message="레시피를 불러오는 중..." />
  }

  if (error || !recipe) {
    return (
      <div className={cx('result')}>
        <div className={cx('error')}>
          <p className={cx('errorText')}>레시피를 불러올 수 없습니다.</p>
          <button className={cx('retryButton')} onClick={() => navigate('/')}>
            다시 분석하기
          </button>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    ...(recipe.thumbnailUrl && { image: recipe.thumbnailUrl }),
    ...(recipe.cookTime && { cookTime: `PT${recipe.cookTime}M` }),
    ...(recipe.servings && { recipeYield: `${recipe.servings}인분` }),
    ...(recipe.difficulty && { description: `난이도: ${recipe.difficulty}` }),
    recipeIngredient: recipe.ingredients.map((i) =>
      `${i.name}${i.amount ? ` ${i.amount}` : ''}${i.unit || ''}`
    ),
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      text: s.description,
    })),
  }

  return (
    <div className={cx('result')}>
      <Helmet>
        <title>{recipe.title} - CookSnap</title>
        <meta name="description" content={`${recipe.title} 레시피 - 재료비 ${recipe.totalPrice ? `${recipe.totalPrice.toLocaleString()}원` : '확인'}, 재료 ${recipe.ingredients.length}가지`} />
        <link rel="canonical" href={`https://aico-cooksnap-web.vercel.app/result/${id}`} />
        <meta property="og:title" content={`${recipe.title} - CookSnap`} />
        <meta property="og:description" content={`재료 ${recipe.ingredients.length}가지${recipe.totalPrice ? `, 총 ${recipe.totalPrice.toLocaleString()}원` : ''}`} />
        {recipe.thumbnailUrl && <meta property="og:image" content={recipe.thumbnailUrl} />}
        <meta property="og:url" content={`https://aico-cooksnap-web.vercel.app/result/${id}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {/* 레시피 헤더 */}
      <div className={cx('header')}>
        <div className={cx('headerTop')}>
          <h1 className={cx('title')}>{recipe.title}</h1>
          {user && (
            <button
              className={cx('saveButton', {
                saved: saveStatus?.saved,
                locked: !user.isPremium,
              })}
              onClick={handleToggleSave}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
            >
              {!user.isPremium && '🔒 '}
              {saveStatus?.saved ? '저장됨' : '저장'}
            </button>
          )}
        </div>
        <div className={cx('meta')}>
          {recipe.difficulty && (
            <span className={cx('metaItem')}>난이도: {recipe.difficulty}</span>
          )}
          {recipe.cookTime && (
            <span className={cx('metaItem')}>{recipe.cookTime}분</span>
          )}
          {recipe.servings && (
            <span className={cx('metaItem')}>{recipe.servings}인분</span>
          )}
        </div>
      </div>

      {/* 재료비 요약 카드 */}
      {recipe.totalPrice && (
        <div className={cx('priceCard')}>
          <p className={cx('totalPrice')}>총 {formatPrice(recipe.totalPrice)}</p>
          {recipe.savingsPercent && (
            <p className={cx('savings')}>
              외식 대비 {recipe.savingsPercent}% 절약
            </p>
          )}
        </div>
      )}

      {/* 재료 리스트 */}
      <div className={cx('section')}>
        <h2 className={cx('sectionTitle')}>재료</h2>
        <div className={cx('ingredientList')}>
          {recipe.ingredients.map((ingredient) => {
            const purchaseUrl = getLinkForIngredient(ingredient.id)
            return (
              <div key={ingredient.id} className={cx('ingredientItem')}>
                <div className={cx('ingredientInfo')}>
                  <span className={cx('ingredientName')}>{ingredient.name}</span>
                  {ingredient.amount && (
                    <span className={cx('ingredientAmount')}>
                      {' '}
                      {ingredient.amount}
                      {ingredient.unit || ''}
                    </span>
                  )}
                </div>
                <div className={cx('ingredientActions')}>
                  <span className={cx('ingredientPrice')}>
                    {formatPrice(ingredient.estimatedPrice)}
                  </span>
                  {purchaseUrl && (
                    <a
                      href={purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx('coupangLink')}
                    >
                      구매
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 조리 단계 */}
      <div className={cx('section')}>
        <h2 className={cx('sectionTitle')}>조리 순서</h2>
        <div className={cx('stepList')}>
          {recipe.steps.map((step) => (
            <div key={step.id} className={cx('stepItem')}>
              <div className={cx('stepNumber')}>{step.stepOrder}</div>
              <p className={cx('stepDescription')}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 쿠팡 파트너스 배너 (모든 유저) */}
      <div className={cx('coupangBanner')}>
        <iframe
          src="https://ads-partners.coupang.com/widgets.html?id=964330&template=carousel&trackingCode=AF5330853&subId=&width=320&height=320&tsource="
          width="320"
          height="320"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 추천 상품"
        />
        <p className={cx('disclaimer')}>
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
          제공받습니다.
        </p>
      </div>

      {/* 쿠팡에서 재료 구매 (sticky) - Premium만 */}
      {purchaseLinks?.[0] && user?.isPremium && (
        <div className={cx('stickyBottom')}>
          <a
            href={purchaseLinks[0].purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('cartButton')}
          >
            쿠팡에서 재료 구매하기
          </a>
        </div>
      )}

      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  )
}

export default Result
