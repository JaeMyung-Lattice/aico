export interface Ingredient {
  id: string
  name: string
  amount: string | null
  unit: string | null
  estimatedPrice: number | null
  kamisItemCode: string | null
  coupangProductUrl: string | null
  sortOrder: number
}

export interface Step {
  id: string
  stepOrder: number
  description: string
}

export interface Recipe {
  id: string
  videoUrl: string
  videoPlatform: string
  title: string
  difficulty: string | null
  cookTime: number | null
  servings: number | null
  totalPrice: number | null
  avgEatOutPrice: number | null
  savingsPercent: number | null
  thumbnailUrl: string | null
  ingredients: Ingredient[]
  steps: Step[]
  createdAt: string
}

export interface PriceInfo {
  ingredientId: string
  name: string
  price: number | null
  unit: string | null
}

export interface PurchaseLink {
  ingredientId: string
  ingredientName: string
  productName: string
  price: number | null
  imageUrl: string | null
  purchaseUrl: string
}

export interface AnalyzeRequest {
  url: string
}

export interface AnalyzeResponse {
  id: string
}
