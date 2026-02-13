import { Router, type IRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import { useEnergy } from '../engine/energy.js'
import { executeBattle } from '../engine/combat.js'
import { generateEnemy, calculateGoldReward } from '../engine/dungeon.js'
import { generateEquipment } from '../engine/item-gen.js'
import { DUNGEON_FLOORS } from '@monster-factory/shared'
import type { DungeonDifficulty, MonsterStats } from '@monster-factory/shared'
import type { AuthRequest } from '../middleware/auth.js'

export const dungeonRouter: IRouter = Router()

interface DungeonEnterBody {
  floor: number
  difficulty: DungeonDifficulty
}

// POST /api/dungeon/enter - 던전 입장
dungeonRouter.post('/enter', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.supabaseId! },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { floor, difficulty } = req.body as DungeonEnterBody

    if (floor < 1 || floor > DUNGEON_FLOORS) {
      res.status(400).json({ error: 'Invalid floor' })
      return
    }

    // 에너지 차감
    const energyUsed = await useEnergy(user.id, 'Dungeon')
    if (!energyUsed) {
      res.status(400).json({ error: 'Not enough energy' })
      return
    }

    // 몬스터 조회
    const monster = await prisma.monster.findFirst({
      where: { userId: user.id },
    })
    if (!monster) {
      res.status(404).json({ error: 'Monster not found' })
      return
    }

    const playerStats: MonsterStats = {
      atk: monster.atk,
      def: monster.def,
      hp: monster.hp,
      agi: monster.agi,
      int: monster.intStat,
      rec: monster.rec,
    }

    // 적 생성 + 전투
    const enemy = generateEnemy(playerStats, floor, difficulty)
    const battleResult = executeBattle(
      { stats: playerStats, element: monster.element as Parameters<typeof executeBattle>[0]['element'] },
      enemy,
    )

    let goldReward = 0
    let equipment = null

    if (battleResult.winner === 'player') {
      goldReward = calculateGoldReward(floor, difficulty)

      // 골드 지급
      await prisma.user.update({
        where: { id: user.id },
        data: { gold: { increment: goldReward } },
      })

      // 장비 드롭 (50% 확률)
      if (Math.random() < 0.5) {
        const equipData = generateEquipment(user.id)
        equipment = await prisma.equipment.create({
          data: equipData,
        })
      }
    }

    // 던전 결과 저장
    await prisma.dungeonResult.create({
      data: {
        userId: user.id,
        floor,
        difficulty,
        result: battleResult.winner === 'player' ? 'win' : 'lose',
        goldReward,
      },
    })

    res.json({
      ...battleResult,
      goldReward,
      equipment,
    })
  } catch {
    res.status(500).json({ error: 'Failed to enter dungeon' })
  }
})
