import { Box, Button, Dialog, Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import AccountList from '../accounting/account-summary'
import { store } from '@/utils'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'

function AccountBalancesModal() {
  const state = store.useState()
  const actions = store.useActions()
  function handleClose() {
    actions.invoice.toggleOpenAccountViewModal()
  }
  const accounts = useMemo(
    () =>
      Object.keys(state.accounting.accounts).map(
        acc => state.accounting.accounts[acc],
      ),
    [state.accounting.accounts],
  )
  useEffect(() => {
    actions.accounting.getAccountSummary()
  }, [])
  return (
    <Dialog onClose={handleClose} open={state.invoice.invoiceAccountsViewOpen}>
      {accounts.length > 0 ? (
        <Box
          sx={{
            padding: '1rem',
            display: 'grid',
            gridAutoRows: 'auto 1fr auto',
            overflow: 'auto',
            minHeight: '80vh',
          }}>
          <Typography variant="h4">Balances</Typography>
          <AccountList />
          <Button
            onClick={() => actions.invoice.toggleOpenAccountViewModal()}
            variant="contained"
            fullWidth>
            Close
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: '70vh',
            padding: '1rem 3rem',
            minWidth: { sm: '500px' },
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}>
          <BrowserNotSupportedIcon sx={{ fontSize: '5rem' }} />
          <Typography variant="h5">No hay datos que mostrar</Typography>
        </Box>
      )}
    </Dialog>
  )
}

export default AccountBalancesModal
