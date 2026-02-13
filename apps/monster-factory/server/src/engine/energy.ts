import { MAX_ENERGY, ENERGY_COST } from '@monster-factory/shared'
import type { EnergyActivity } from '@monster-factory/shared'
import { prisma } from '../lib/prisma.js'

/**
 * 오늘 자정(KST) 기준 시작 시간
 */
const getTodayStartKST = (): Date => {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  kst.setUTCHours(0, 0, 0, 0)
  return new Date(kst.getTime() - 9 * 60 * 60 * 1000)
}

/**
 * 다음 리셋 시간 (KST 자정)
 */
export const getNextResetTime = (): Date => {
  const todayStart = getTodayStartKST()
  return new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
}

/**
 * 오늘 사용한 에너지 총량
 */
export const getUsedEnergyToday = async (userId: string): Promise<number> => {
  const todayStart = getTodayStartKST()

  const logs = await prisma.energyLog.findMany({
    where: {
      userId,
      usedAt: { gte: todayStart },
    },
  })

  return logs.reduce((sum, log) => {
    const cost = ENERGY_COST[log.activity as keyof typeof ENERGY_COST] ?? 1
    return sum + cost
  }, 0)
}

/**
 * 남은 에너지 조회
 */
export const getRemainingEnergy = async (userId: string): Promise<number> => {
  const used = await getUsedEnergyToday(userId)
  return Math.max(0, MAX_ENERGY - used)
}

/**
 * 에너지 사용 시도
 */
export const useEnergy = async (
  userId: string,
  activity: EnergyActivity,
): Promise<boolean> => {
  const cost = ENERGY_COST[activity]
  const remaining = await getRemainingEnergy(userId)

  if (remaining < cost) return false

  await prisma.energyLog.create({
    data: { userId, activity },
  })

  return true
}
