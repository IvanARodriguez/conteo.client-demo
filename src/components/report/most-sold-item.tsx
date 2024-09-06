import { store } from '@/utils'
import styled from '@emotion/styled'
import { Box, Paper, Typography } from '@mui/material'
import { useEffect } from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

function MostSoldItem() {
  const state = store.useState()
  const actions = store.useActions()
  const product = state.product.products.filter(
    p => p.id === state.dashboard.weekStatus.mostSoldProduct.productId,
  )
  useEffect(() => {
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
  }, [])
  return (
    <Box
      flex={1}
      component={Paper}
      flexDirection={'column'}
      justifyContent={'center'}
      pl={'1rem'}
      gap={'1rem'}
      display={'flex'}>
      <Box display={'flex'} alignItems={'center'} gap={'1rem'}>
        <AddShoppingCartIcon sx={{ fontSize: '3rem' }} />
        <Typography variant="h6">Producto MVP</Typography>
        <Typography variant="h6">
          {product.length > 0 ? product[0].name : 'No Definido'}{' '}
        </Typography>
        <Typography>{`(${
          state.dashboard.weekStatus.mostSoldProduct.total_sold ?? 0
        }) Ventas`}</Typography>
      </Box>
    </Box>
  )
}

export default MostSoldItem
