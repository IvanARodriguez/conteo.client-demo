import { store } from '@/utils'
import {
  Box,
  Button,
  Dialog,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

function CreateAccount() {
  const actions = store.useActions()
  const state = store.useState()
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.accounting.createAccount()
  }
  return (
    <Dialog
      onClose={() => actions.accounting.setCreateAccountFormOpen()}
      open={state.accounting.createAccountForm.open}>
      <Paper
        component={'form'}
        onSubmit={handleSubmit}
        sx={{
          padding: '1rem',
          flexDirection: 'column',
          display: 'flex',
          gap: '1rem',
        }}>
        <Typography variant="h4">Crear Cuenta</Typography>
        <TextField
          value={state.accounting.createAccountForm.accountName}
          onChange={e => {
            actions.accounting.setAccountName(e.target.value ?? '')
          }}
          label="Nombre de Cuenta"
        />
        <TextField
          value={state.accounting.createAccountForm.confirmation}
          onChange={e =>
            actions.accounting.setCreateAccountConfirmation(
              e.target.value ?? '',
            )
          }
          label="Escriba 'Confirmar'"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={
            state.accounting.createAccountForm.confirmation !== 'Confirmar'
          }>
          Crear
        </Button>
      </Paper>
    </Dialog>
  )
}

export default CreateAccount
