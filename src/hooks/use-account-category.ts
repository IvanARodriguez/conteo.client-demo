import { Account } from '@/types'
import { store } from '@/utils'
import { useEffect, useMemo } from 'react'

const useAccountCategory = (selectedAccount: Account | undefined) => {
  const categories = useMemo(() => {
    if (!selectedAccount) return []
    return Object.keys(selectedAccount.categories).map(k => {
      return { ...selectedAccount.categories[k], categoryName: k }
    })
  }, [selectedAccount?.id])

  return categories
}
export default useAccountCategory
