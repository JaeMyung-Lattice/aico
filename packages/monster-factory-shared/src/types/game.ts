export const MinigameType = {
  TimingClick: 'TimingClick',
  PatternMemory: 'PatternMemory',
  MashChallenge: 'MashChallenge',
  ReactionTest: 'ReactionTest',
  Quiz: 'Quiz',
  RhythmGame: 'RhythmGame',
} as const

export type MinigameType = (typeof MinigameType)[keyof typeof MinigameType]

export const MiniGameGrade = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const

export type MiniGameGrade = (typeof MiniGameGrade)[keyof typeof MiniGameGrade]

export const DungeonDifficulty = {
  Easy: 'Easy',
  Normal: 'Normal',
  Hard: 'Hard',
  Hell: 'Hell',
} as const

export type DungeonDifficulty =
  (typeof DungeonDifficulty)[keyof typeof DungeonDifficulty]

export const EnergyActivity = {
  Minigame: 'Minigame',
  Dungeon: 'Dungeon',
  PvP: 'PvP',
  Boss: 'Boss',
} as const

export type EnergyActivity =
  (typeof EnergyActivity)[keyof typeof EnergyActivity]

export interface GradeResult {
  grade: MiniGameGrade
  score: number
  statIncrease: number
  statType: string
}

export interface BattleTurnLog {
  turn: number
  attacker: 'player' | 'enemy'
  damage: number
  playerHp: number
  enemyHp: number
  isCritical: boolean
}

export interface BattleResult {
  winner: 'player' | 'enemy'
  turns: BattleTurnLog[]
  goldReward: number
}
