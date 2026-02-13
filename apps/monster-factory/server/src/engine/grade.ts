import {
  MiniGameGrade,
  GRADE_STAT_BONUS,
  type MinigameType,
  type GradeResult,
} from '@monster-factory/shared'

interface TimingClickLog {
  tapTime: number
  gaugePosition: number // 0~100, 50이 중앙
}

interface PatternMemoryLog {
  pattern: number[]
  userInput: number[]
  timeMs: number
}

interface MashChallengeLog {
  taps: number[]
  durationMs: number
}

type InputLog = TimingClickLog | PatternMemoryLog | MashChallengeLog

// 스탯 타입 매핑
const MINIGAME_STAT_MAP: Record<string, string> = {
  TimingClick: 'atk',
  PatternMemory: 'def',
  MashChallenge: 'hp',
  ReactionTest: 'agi',
  Quiz: 'int',
  RhythmGame: 'rec',
}

/**
 * 서버사이드 등급 산정 (안티치트)
 */
export const calculateGrade = (
  minigameType: MinigameType,
  score: number,
  inputLog: InputLog,
): GradeResult => {
  // 기본 유효성 검사
  if (score < 0 || score > 10000) {
    return {
      grade: MiniGameGrade.D,
      score: 0,
      statIncrease: GRADE_STAT_BONUS.D,
      statType: MINIGAME_STAT_MAP[minigameType] ?? 'atk',
    }
  }

  // 안티치트: 입력 로그 기반 검증
  const validatedScore = validateAndRecalcScore(minigameType, inputLog)

  // 클라이언트 점수와 서버 점수 비교 (20% 이상 차이 → D등급)
  if (Math.abs(validatedScore - score) > score * 0.2) {
    return {
      grade: MiniGameGrade.D,
      score: validatedScore,
      statIncrease: GRADE_STAT_BONUS.D,
      statType: MINIGAME_STAT_MAP[minigameType] ?? 'atk',
    }
  }

  const grade = scoreToGrade(validatedScore)

  return {
    grade,
    score: validatedScore,
    statIncrease: GRADE_STAT_BONUS[grade],
    statType: MINIGAME_STAT_MAP[minigameType] ?? 'atk',
  }
}

const scoreToGrade = (score: number): MiniGameGrade => {
  if (score >= 9000) return MiniGameGrade.S
  if (score >= 7000) return MiniGameGrade.A
  if (score >= 5000) return MiniGameGrade.B
  if (score >= 3000) return MiniGameGrade.C
  return MiniGameGrade.D
}

const validateAndRecalcScore = (
  _minigameType: MinigameType,
  _inputLog: InputLog,
): number => {
  // TODO: 미니게임별 상세 검증 로직
  // Phase 1에서는 기본 검증만 수행
  // - TimingClick: gaugePosition 기반 점수 재계산
  // - PatternMemory: pattern/userInput 일치율 검증
  // - MashChallenge: 탭 간격 50ms 최소 검증
  return 5000 // 기본값, 상세 구현은 Phase 4 테스트에서
}
