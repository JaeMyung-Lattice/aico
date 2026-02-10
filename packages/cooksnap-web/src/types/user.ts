export interface User {
  id: string
  email: string
  nickname: string | null
  provider: string
  createdAt: string
}

export interface SavedRecipe {
  id: string
  recipeId: string
  recipe: {
    id: string
    title: string
    thumbnailUrl: string | null
    totalPrice: number | null
    difficulty: string | null
  }
  createdAt: string
}

export interface AnalysisHistoryItem {
  id: string
  recipeId: string
  videoUrl: string
  recipe: {
    id: string
    title: string
    thumbnailUrl: string | null
  }
  createdAt: string
}
