import {
  type MonsterStats,
  type Element,
  type DungeonDifficulty,
  DUNGEON_GOLD_REWARD,
  INITIAL_STAT_VALUE,
} from '@monster-factory/shared'

const ELEMENTS: Element[] = ['Chemical', 'Gear', 'Neon', 'Nitro', 'Crystal', 'Plasma']

/**
 * 유저 스탯 ±20% 범위로 적 생성
 */
export const generateEnemy = (
  playerStats: MonsterStats,
  floor: number,
  difficulty: DungeonDifficulty,
): { stats: MonsterStats; element: Element } => {
  const difficultyMul = getDifficultyMultiplier(difficulty)
  const floorMul = 1 + (floor - 1) * 0.15

  const randomStat = (baseStat: number): number => {
    const base = Math.max(INITIAL_STAT_VALUE, baseStat * difficultyMul * floorMul)
    const variance = base * 0.2
    return Math.max(1, base + (Math.random() * 2 - 1) * variance)
  }

  return {
    stats: {
      atk: randomStat(playerStats.atk),
      def: randomStat(playerStats.def),
      hp: randomStat(playerStats.hp),
      agi: randomStat(playerStats.agi),
      int: randomStat(playerStats.int),
      rec: randomStat(playerStats.rec),
    },
    element: ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]!,
  }
}

/**
 * 골드 보상 계산
 */
export const calculateGoldReward = (
  floor: number,
  difficulty: DungeonDifficulty,
): number => {
  const baseGold = DUNGEON_GOLD_REWARD[difficulty]
  return Math.floor(baseGold * (1 + (floor - 1) * 0.2))
}

const getDifficultyMultiplier = (difficulty: DungeonDifficulty): number => {
  const map: Record<DungeonDifficulty, number> = {
    Easy: 0.7,
    Normal: 1.0,
    Hard: 1.4,
    Hell: 2.0,
  }
  return map[difficulty]
}
