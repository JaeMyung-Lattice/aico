import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import classnames from 'classnames/bind'
import api from '@/lib/api'
import type { Recipe } from '@/types/recipe'
import styles from './ResultPage.module.scss'

const cx = classnames.bind(styles)

const formatPrice = (price: number | null): string => {
  if (price === null) return '-'
  return `${price.toLocaleString()}원`
}

const getCoupangSearchUrl = (keyword: string): string => {
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`
}

const Result = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data } = await api.get(`/recipes/${id}`)
      return data
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className={cx('result')}>
        <div className={cx('loading')}>
          <p className={cx('loadingText')}>레시피를 불러오는 중...</p>
        </div>
      </div>
    )
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
        <h1 className={cx('title')}>{recipe.title}</h1>
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
          {recipe.ingredients.map((ingredient) => (
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
                <a
                  href={getCoupangSearchUrl(ingredient.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx('coupangLink')}
                >
                  구매
                </a>
              </div>
            </div>
          ))}
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

      {/* 쿠팡에서 재료 검색 (sticky) */}
      <div className={cx('stickyBottom')}>
        <a
          href={getCoupangSearchUrl(recipe.ingredients.map((i) => i.name).join(' '))}
          target="_blank"
          rel="noopener noreferrer"
          className={cx('cartButton')}
        >
          쿠팡에서 재료 한번에 검색하기
        </a>
      </div>
    </div>
  )
}

export default Result
