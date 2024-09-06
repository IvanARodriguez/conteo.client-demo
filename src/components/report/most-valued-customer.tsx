import { store } from '@/utils'
import styled from '@emotion/styled'
import { Box, Paper, Typography } from '@mui/material'
import { useEffect } from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'

function MostValuedCustomer() {
  const state = store.useState()
  const actions = store.useActions()
  const customer = state.customer.customers.filter(
    c =>
      c.id === state.dashboard.weekStatus.customerWithMostPurchases.customer_id,
  )
  useEffect(() => {
    if (state.customer.customers.length === 0) {
      actions.customer.getCustomers()
    }
  }, [])
  return (
    <Box
      flex={1}
      component={Paper}
      flexDirection={'column'}
      p={'.5rem'}
      gap={'.5rem'}
      display={'flex'}>
      <Box display={'flex'} alignItems={'center'} gap={'1rem'}>
        <AssignmentIndIcon sx={{ fontSize: '3rem' }} />
        <Typography variant="h6">Cliente MVP -</Typography>
        <Typography variant="h6">
          {customer.length > 0 ? customer[0].name : 'No Definido'}{' '}
        </Typography>
        <Typography>
          {' '}
          {`(${
            state.dashboard.weekStatus.customerWithMostPurchases
              .total_invoices ?? 0
          }) Compras`}
        </Typography>
      </Box>
    </Box>
  )
}

export default MostValuedCustomer
