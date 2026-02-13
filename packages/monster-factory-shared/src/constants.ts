import type { Element, MonsterStats, Personality } from './types/monster.js'
import type { MiniGameGrade } from './types/game.js'
import type { StatType } from './types/item.js'

// 기본 스탯
export const INITIAL_STAT_VALUE = 5

// 에너지 시스템
export const MAX_ENERGY = 5
export const ENERGY_RESET_HOUR_KST = 0

// 에너지 소비
export const ENERGY_COST = {
  Minigame: 1,
  Dungeon: 2,
  PvP: 1,
  Boss: 3,
} as const

// 속성 상성 맵 (attacker → defender = advantage)
export const ELEMENT_ADVANTAGE: Record<Element, Element> = {
  Chemical: 'Nitro',
  Gear: 'Chemical',
  Neon: 'Gear',
  Nitro: 'Neon',
  Crystal: 'Plasma',
  Plasma: 'Crystal',
} as const

export const ELEMENT_ADVANTAGE_MULTIPLIER = 1.2
export const ELEMENT_DISADVANTAGE_MULTIPLIER = 0.8

// 등급별 스탯 보너스
export const GRADE_STAT_BONUS: Record<MiniGameGrade, number> = {
  S: 3.0,
  A: 2.0,
  B: 1.0,
  C: 0.5,
  D: 0.3,
} as const

// 성격 보정치 { stat: multiplier } (1.0 = 기본)
export const PERSONALITY_MODIFIERS: Record<
  Personality,
  Partial<Record<StatType, number>>
> = {
  Brave: { atk: 1.05, def: 0.97 },
  Cautious: { def: 1.05, agi: 0.97 },
  Mischievous: { agi: 1.05, rec: 0.97 },
  Relaxed: { rec: 1.05, atk: 0.97 },
  Unstable: { atk: 1.08 }, // ±8% 랜덤은 서버에서 처리
  Tough: { hp: 1.05, int: 0.97 },
} as const

// 성장 단계 전환 기준 (총 스탯 합)
export const GROWTH_THRESHOLDS = {
  Baby: 30, // Egg → Baby
  Boy: 81, // Baby → Boy
  Adult: 180, // Boy → Adult
  Awakened: 360, // Adult → Awakened
} as const

// 아이템 등급별 스탯 범위
export const ITEM_GRADE_STAT_RANGE = {
  Normal: { min: 1, max: 3 },
  Uncommon: { min: 3, max: 6 },
  Rare: { min: 6, max: 10 },
} as const

// 아이템 드롭 확률
export const ITEM_GRADE_DROP_RATES = {
  Normal: 0.6,
  Uncommon: 0.3,
  Rare: 0.1,
} as const

// 던전 설정
export const DUNGEON_FLOORS = 5
export const DUNGEON_GOLD_REWARD = {
  Easy: 50,
  Normal: 100,
  Hard: 200,
  Hell: 500,
} as const

// 크리티컬 배율
export const CRITICAL_MULTIPLIER = 1.5
export const BASE_CRITICAL_RATE = 0.1

// 초기 골드
export const INITIAL_GOLD = 100

// 초기 몬스터 스탯
export const INITIAL_MONSTER_STATS: MonsterStats = {
  atk: INITIAL_STAT_VALUE,
  def: INITIAL_STAT_VALUE,
  hp: INITIAL_STAT_VALUE,
  agi: INITIAL_STAT_VALUE,
  int: INITIAL_STAT_VALUE,
  rec: INITIAL_STAT_VALUE,
}
