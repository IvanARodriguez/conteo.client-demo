import { Box, List, ListItemButton, ListItemText } from '@mui/material'
import FormatCurrency from '../global/format-currency'
import useAccountOrCategoryDefaultName from '@/hooks/use-default-account-name'
import { store } from '@/utils'
import { useLayoutEffect } from 'react'

/**
 * @param props A list of accounts and their details
 * @returns
 */
export default function AccountList() {
  const state = store.useState()
  const actions = store.useActions()

  // Use layout effect to fetch account summary when component mounts
  useLayoutEffect(() => {
    if (Object.keys(state.accounting.accounts).length === 0) {
      actions.accounting.getAccountSummary()
    }
  }, [])

  // Sort accounts by accountName
  const sortedAccounts = Object.values(state.accounting.accounts)

  return (
    <Box sx={{ overflow: 'auto', minWidth: { sm: '350px' } }}>
      {sortedAccounts.map((account, index) => (
        <List key={index + account.id}>
          <ListItemButton
            onClick={() => actions.accounting.setSelectedAccount(account)}
            selected={
              state.accounting.selectedAccount.accountName ===
              account.accountName
            }
            sx={{ borderRadius: '.5rem' }}>
            <ListItemText sx={{ p: '0.25rem' }}>
              {useAccountOrCategoryDefaultName(account.accountName)}
              <FormatCurrency value={account.total} />
            </ListItemText>
          </ListItemButton>
        </List>
      ))}
    </Box>
  )
}
