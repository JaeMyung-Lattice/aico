import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import classnames from 'classnames/bind'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { Loading } from '@repo/ui'
import type { Recipe, PurchaseLink } from '@/types/recipe'
import styles from './ResultPage.module.scss'

const cx = classnames.bind(styles)

const formatPrice = (price: number | null): string => {
  if (price === null) return '-'
  return `${price.toLocaleString()}원`
}

const Result = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data } = await api.get(`/recipes/${id}`)
      return data
    },
    enabled: !!id,
  })

  // 저장 여부 확인 (로그인 시에만)
  const { data: saveStatus } = useQuery<{ saved: boolean }>({
    queryKey: ['recipe-saved', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/me/recipes/${id}/saved`)
      return data
    },
    enabled: !!user && !!id,
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

  if (isLoading) {
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

  return (
    <div className={cx('result')}>
      {/* 레시피 헤더 */}
      <div className={cx('header')}>
        <div className={cx('headerTop')}>
          <h1 className={cx('title')}>{recipe.title}</h1>
          {user && (
            <button
              className={cx('saveButton', { saved: saveStatus?.saved })}
              onClick={handleToggleSave}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
            >
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

      {/* 쿠팡 파트너스 배너 */}
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

      {/* 쿠팡에서 재료 구매 (sticky) */}
      {purchaseLinks?.[0] && (
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
    </div>
  )
}

export default Result
