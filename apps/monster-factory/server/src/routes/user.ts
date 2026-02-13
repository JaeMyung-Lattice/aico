import { Router, type IRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import type { AuthRequest } from '../middleware/auth.js'

export const userRouter: IRouter = Router()

// GET /api/users/me - 내 정보
userRouter.get('/me', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.supabaseId! },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// PATCH /api/users/me/tutorial - 튜토리얼 완료
userRouter.patch('/me/tutorial', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.update({
      where: { supabaseId: req.supabaseId! },
      data: { tutorialCompleted: true },
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to update tutorial status' })
  }
})
