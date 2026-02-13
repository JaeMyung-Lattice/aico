import { Router, type IRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import type { AuthRequest } from '../middleware/auth.js'

export const authRouter: IRouter = Router()

// GET /api/auth/me - 현재 유저 정보 (없으면 자동 생성)
authRouter.get('/me', async (req: AuthRequest, res) => {
  try {
    const supabaseId = req.supabaseId!

    let user = await prisma.user.findUnique({
      where: { supabaseId },
      include: { monsters: true },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { supabaseId },
        include: { monsters: true },
      })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})
