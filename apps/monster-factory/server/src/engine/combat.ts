import {
  calcPhysDamage,
  calcElementMultiplier,
  CRITICAL_MULTIPLIER,
  BASE_CRITICAL_RATE,
  type BattleTurnLog,
  type BattleResult,
  type MonsterStats,
  type Element,
} from '@monster-factory/shared'

interface Combatant {
  stats: MonsterStats
  element: Element
  hp: number
}

/**
 * 턴제 자동 전투 실행
 */
export const executeBattle = (
  player: { stats: MonsterStats; element: Element },
  enemy: { stats: MonsterStats; element: Element },
): BattleResult => {
  const playerState: Combatant = {
    ...player,
    hp: player.stats.hp * 10,
  }
  const enemyState: Combatant = {
    ...enemy,
    hp: enemy.stats.hp * 10,
  }

  const turns: BattleTurnLog[] = []
  let turn = 0
  const maxTurns = 50

  while (playerState.hp > 0 && enemyState.hp > 0 && turn < maxTurns) {
    turn++

    // 속도 순서 (agi 높은 쪽 먼저)
    const playerFirst = player.stats.agi >= enemy.stats.agi

    if (playerFirst) {
      attackTurn(playerState, enemyState, player.element, enemy.element, turns, turn, 'player')
      if (enemyState.hp <= 0) break
      attackTurn(enemyState, playerState, enemy.element, player.element, turns, turn, 'enemy')
    } else {
      attackTurn(enemyState, playerState, enemy.element, player.element, turns, turn, 'enemy')
      if (playerState.hp <= 0) break
      attackTurn(playerState, enemyState, player.element, enemy.element, turns, turn, 'player')
    }
  }

  const winner = playerState.hp > 0 ? 'player' : 'enemy'

  return {
    winner: winner as 'player' | 'enemy',
    turns,
    goldReward: 0, // dungeon 엔진에서 설정
  }
}

const attackTurn = (
  attacker: Combatant,
  defender: Combatant,
  attackerElement: Element,
  defenderElement: Element,
  turns: BattleTurnLog[],
  turn: number,
  who: 'player' | 'enemy',
) => {
  const baseDmg = calcPhysDamage(attacker.stats.atk, 1, defender.stats.def)
  const elementMul = calcElementMultiplier(attackerElement, defenderElement)
  const isCritical = Math.random() < BASE_CRITICAL_RATE
  const critMul = isCritical ? CRITICAL_MULTIPLIER : 1

  const damage = Math.max(1, Math.floor(baseDmg * elementMul * critMul))
  defender.hp = Math.max(0, defender.hp - damage)

  turns.push({
    turn,
    attacker: who,
    damage,
    playerHp: who === 'player' ? attacker.hp : defender.hp,
    enemyHp: who === 'player' ? defender.hp : attacker.hp,
    isCritical,
  })
}
