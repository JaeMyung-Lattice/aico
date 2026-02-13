import {
  EquipSlot,
  ItemGrade,
  ITEM_GRADE_DROP_RATES,
  ITEM_GRADE_STAT_RANGE,
  type Equipment,
  type StatType,
} from '@monster-factory/shared'

const SLOTS: EquipSlot[] = ['Weapon', 'Armor', 'Accessory']
const STAT_TYPES: StatType[] = ['atk', 'def', 'hp', 'agi', 'int', 'rec']

const SLOT_NAMES: Record<EquipSlot, string[]> = {
  Weapon: ['낡은 검', '기어 블레이드', '네온 스태프', '결정 활', '플라즈마 건'],
  Armor: ['가죽 갑옷', '기어 아머', '네온 실드', '결정 로브', '강철 판금'],
  Accessory: ['부적', '기어 링', '네온 펜던트', '결정 반지', '플라즈마 코어'],
}

/**
 * 장비 아이템 생성
 */
export const generateEquipment = (userId: string): Omit<Equipment, 'id' | 'createdAt'> => {
  const grade = rollGrade()
  const slot = SLOTS[Math.floor(Math.random() * SLOTS.length)]!
  const statType = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)]!
  const range = ITEM_GRADE_STAT_RANGE[grade]
  const statValue = range.min + Math.random() * (range.max - range.min)
  const names = SLOT_NAMES[slot]!
  const name = names[Math.floor(Math.random() * names.length)]!

  return {
    userId,
    monsterId: null,
    name,
    slot,
    grade,
    statType,
    statValue: Math.round(statValue * 10) / 10,
  }
}

const rollGrade = (): ItemGrade => {
  const roll = Math.random()
  if (roll < ITEM_GRADE_DROP_RATES.Rare) return ItemGrade.Rare
  if (roll < ITEM_GRADE_DROP_RATES.Rare + ITEM_GRADE_DROP_RATES.Uncommon) return ItemGrade.Uncommon
  return ItemGrade.Normal
}
