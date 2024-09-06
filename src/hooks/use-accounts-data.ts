import { store } from '@/utils'
import React, { useEffect, useMemo } from 'react'

function useAccountsData() {
  const state = store.useState()
  const accounts = useMemo(() => {
    return Object.values(state.accounting.accounts)
  }, [state.accounting.accounts])

  return accounts
}

export default useAccountsData
