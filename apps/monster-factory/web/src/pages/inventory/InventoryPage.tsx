import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { EquipmentCard } from '@/components/EquipmentCard'
import styles from './InventoryPage.module.scss'

export const InventoryPage = () => {
  const navigate = useNavigate()
  const { equipment, loading, fetchInventory, equipItem, unequipItem } =
    useInventoryStore()

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const equipped = equipment.filter((e) => e.monsterId)
  const unequipped = equipment.filter((e) => !e.monsterId)

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>인벤토리</h2>

      {equipped.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>장착 중</h3>
          <div className={styles.grid}>
            {equipped.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onAction={() => unequipItem(item.id)}
                actionLabel="해제"
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>보관함 ({unequipped.length})</h3>
        {unequipped.length === 0 ? (
          <p className={styles.empty}>장비가 없습니다. 던전에서 획득하세요!</p>
        ) : (
          <div className={styles.grid}>
            {unequipped.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onAction={() => equipItem(item.id)}
                actionLabel="장착"
              />
            ))}
          </div>
        )}
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/game')}>
        돌아가기
      </button>
    </div>
  )
}
