import { store } from '@/utils'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import React from 'react'

function InvoiceTransactionModal(props: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const state = store.useState()
  const actions = store.useActions()

  function handleClose() {
    actions.transaction.setInvoiceTransactionModal(false)
    actions.transaction.setInvoiceFormAmount(0)
    actions.transaction.setInvoiceFormDescription('')
    actions.transaction.setInvoiceFormDestination('Cashier')
    actions.transaction.setInvoicePendingBalance(0)
    actions.transaction.setInvoiceFormInvoiceId('')
  }
  function isInvalidAmount() {
    const pendingBalance =
      state.transaction.invoiceTransactionForm.pendingBalance
    if (pendingBalance) {
      return state.transaction.invoiceTransactionForm.amount > pendingBalance
    }
    return false
  }
  return (
    <Dialog
      onClose={handleClose}
      maxWidth={false}
      open={state.transaction.createTransactionModal}
      PaperProps={{ sx: { p: '1rem .5rem' } }}>
      <Box
        component={'form'}
        onSubmit={props.onSubmit}
        sx={{
          minWidth: {
            xs: '290px',
            sm: '400px',
            md: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          },
        }}>
        <FormControl fullWidth>
          <InputLabel id="payment-method">Destino de pago</InputLabel>
          <Select
            labelId="payment-method"
            id="payment-method"
            value={state.transaction.invoiceTransactionForm.destination}
            label="Age"
            onChange={(event: SelectChangeEvent) =>
              actions.transaction.setInvoiceFormDestination(
                event.target.value as 'Bank' | 'Cashier',
              )
            }>
            <MenuItem value={'Cashier'} defaultChecked>
              Caja
            </MenuItem>
            <MenuItem value={'Bank'}>Banco</MenuItem>
          </Select>
        </FormControl>
        <TextField
          error={isInvalidAmount()}
          value={state.transaction.invoiceTransactionForm.amount}
          label="Monto a pagar"
          onChange={e => {
            actions.transaction.setInvoiceFormAmount(
              Number.parseFloat(e.target.value),
            )
          }}
          fullWidth
          helperText={
            isInvalidAmount()
              ? `Monto no puede exceder el total de la factura ${state.transaction.invoiceTransactionForm.pendingBalance}`
              : `Monto debe ser menor o igual a $${state.transaction.invoiceTransactionForm.pendingBalance}`
          }
          type="number"
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={5}
          value={state.transaction.invoiceTransactionForm.description}
          onChange={e =>
            actions.transaction.setInvoiceFormDescription(e.target.value)
          }
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={state.transaction.submitState === 'submitting'}>
          Someter
        </LoadingButton>
      </Box>
    </Dialog>
  )
}

export default InvoiceTransactionModal
