import {
  Element,
  Personality,
  INITIAL_MONSTER_STATS,
  type MonsterStats,
} from '@monster-factory/shared'

const ELEMENTS = Object.values(Element) as Element[]
const PERSONALITIES = Object.values(Personality) as Personality[]

const pickRandom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!

export interface HatchResult {
  element: Element
  personality: Personality
  stats: MonsterStats
}

export const generateMonster = (): HatchResult => ({
  element: pickRandom(ELEMENTS),
  personality: pickRandom(PERSONALITIES),
  stats: { ...INITIAL_MONSTER_STATS },
})
