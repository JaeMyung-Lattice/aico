import { Router, type IRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import { getRemainingEnergy, getNextResetTime } from '../engine/energy.js'
import { MAX_ENERGY } from '@monster-factory/shared'
import type { AuthRequest } from '../middleware/auth.js'

export const energyRouter: IRouter = Router()

// GET /api/energy - 에너지 잔량 조회
energyRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.supabaseId! },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const remaining = await getRemainingEnergy(user.id)
    const nextResetAt = getNextResetTime().toISOString()

    res.json({ remaining, max: MAX_ENERGY, nextResetAt })
  } catch {
    res.status(500).json({ error: 'Failed to fetch energy' })
  }
})
