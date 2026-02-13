import { Router, type IRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import { generateMonster } from '../engine/hatch.js'
import type { AuthRequest } from '../middleware/auth.js'

export const monsterRouter: IRouter = Router()

// GET /api/monsters/me - 내 몬스터 조회
monsterRouter.get('/me', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.supabaseId! },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const monster = await prisma.monster.findFirst({
      where: { userId: user.id },
    })

    res.json(monster)
  } catch {
    res.status(500).json({ error: 'Failed to fetch monster' })
  }
})

// POST /api/monsters/hatch - 몬스터 부화
monsterRouter.post('/hatch', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.supabaseId! },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // 이미 몬스터가 있으면 거부
    const existing = await prisma.monster.findFirst({
      where: { userId: user.id },
    })
    if (existing) {
      res.status(400).json({ error: 'Already have a monster' })
      return
    }

    const { element, personality, stats } = generateMonster()

    const monster = await prisma.monster.create({
      data: {
        userId: user.id,
        element,
        personality,
        atk: stats.atk,
        def: stats.def,
        hp: stats.hp,
        agi: stats.agi,
        intStat: stats.int,
        rec: stats.rec,
        growthStage: 'Egg',
      },
    })

    res.json(monster)
  } catch {
    res.status(500).json({ error: 'Failed to hatch monster' })
  }
})
