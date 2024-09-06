import { store } from '@/utils'
import {
  Box,
  Dialog,
  Divider,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useLayoutEffect } from 'react'

function ViewProduct() {
  const state = store.useState()
  const actions = store.useActions()
  const theme = useTheme()
  const selectedProductId = state.product.selectedProductId
  const product = state.product.products.filter(
    p => p.id === selectedProductId,
  )[0]

  function handleClose() {
    actions.product.setProductViewModal()
  }

  if (!product) {
    return <></>
  }

  return (
    <Dialog onClose={handleClose} open={state.product.viewProductModalOpen}>
      <Box
        component={Paper}
        sx={{
          p: '1rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '1rem',
          justifyContent: 'start',
        }}>
        <Typography
          variant="h4"
          color={'primary'}
          sx={{ gridColumn: 'span 2' }}>
          {product.name}
        </Typography>
        <Divider
          sx={{
            gridColumn: 'span 2',
            borderBottomWidth: '.5rem',
            borderRadius: '1rem',
          }}
        />
        <Typography>id:</Typography>
        <Typography>{product.id}</Typography>
        <Typography> Creado: </Typography>
        <Typography>{new Date(product.createdAt).toLocaleString()}</Typography>
        <Typography> Actualizado: </Typography>
        <Typography>{new Date(product.updatedAt).toLocaleString()}</Typography>
        <Typography> Detalle: </Typography>
        <Typography>{product.details}</Typography>
        <Typography> Deshabilitado:</Typography>
        <Typography>{product.disabled ? 'Si' : 'No'}</Typography>
        <Typography>Incluido en inventario:</Typography>
        <Typography>{product.inventory_managed ? 'Si' : 'No'}</Typography>
        {product.inventory_managed ? (
          <>
            <Typography>Disponible:</Typography>
            <Typography>{product.inventory_quantity}</Typography>
          </>
        ) : null}
      </Box>
    </Dialog>
  )
}

export default ViewProduct
