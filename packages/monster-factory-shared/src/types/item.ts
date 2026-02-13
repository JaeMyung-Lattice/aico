export const EquipSlot = {
  Weapon: 'Weapon',
  Armor: 'Armor',
  Accessory: 'Accessory',
} as const

export type EquipSlot = (typeof EquipSlot)[keyof typeof EquipSlot]

export const ItemGrade = {
  Normal: 'Normal',
  Uncommon: 'Uncommon',
  Rare: 'Rare',
} as const

export type ItemGrade = (typeof ItemGrade)[keyof typeof ItemGrade]

export type StatType = 'atk' | 'def' | 'hp' | 'agi' | 'int' | 'rec'

export interface Equipment {
  id: string
  userId: string
  monsterId: string | null
  name: string
  slot: EquipSlot
  grade: ItemGrade
  statType: StatType
  statValue: number
  createdAt: string
}
