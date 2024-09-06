import { store } from '@/utils'
import WarningIcon from '@mui/icons-material/ReportGmailerrorred'
import {
  Box,
  Button,
  Dialog,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

function NullifyInvoice() {
  const state = store.useState()
  const actions = store.useActions()
  const [confirmError, setConfirmError] = React.useState('')
  const [nullReasonError, setNullReasonError] = React.useState('')

  function handleConfirm(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    actions.invoice.setConfirm(e.target.value)
    if (state.invoice.nullingForm.confirm.includes('Confirmar')) {
      setConfirmError('')
    } else {
      setConfirmError('Debe de escribir "Confirmar"')
    }
  }

  function handleNullReason(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    actions.invoice.setNullReason(e.target.value)
    if (state.invoice.nullingForm.reason) {
      setNullReasonError('')
    } else {
      setNullReasonError('Este campo es obligatorio para anular una factura')
    }
  }

  function handleCLose() {
    actions.invoice.setNullModal(false)
    actions.invoice.setNullReason('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.invoice.deleteInvoice()
    actions.invoice.setNullModal(false)
    actions.invoice.setNullReason('')
    actions.invoice.reloadInvoices()
  }
  return (
    <Dialog
      open={state.invoice.nullingForm.nullFormOpen}
      fullWidth
      keepMounted
      onClose={handleCLose}
      sx={{
        '.MuiPaper-root': {
          maxWidth: '700px',
          p: '1rem',
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          mb: '2rem',
        }}>
        <WarningIcon sx={{ fontSize: '6rem', color: 'divider' }} />
        <Box>
          <Typography variant="h4">Anular Factura</Typography>
          <Typography color={'error'}>Esta acción es irreversible</Typography>
        </Box>
      </Box>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Stack gap={'1rem'}>
          <TextField
            label="Confirmación"
            value={state.invoice.nullingForm.confirm}
            error={confirmError.length > 0}
            placeholder=" Escriba 'Confirmar' para anular"
            fullWidth
            onChange={handleConfirm}
            helperText={
              <Typography variant="caption">{confirmError}</Typography>
            }
          />
          <TextField
            rows={3}
            multiline
            label="Motivo de anulación"
            value={state.invoice.nullingForm.reason}
            error={nullReasonError.length > 0}
            placeholder=" Escriba la razón de eliminar esta factura"
            fullWidth
            onChange={handleNullReason}
            helperText={
              <Typography variant="caption">{nullReasonError}</Typography>
            }
          />
          <Box display={'flex'} gap={'1rem'} justifyContent={'center'}>
            <Button variant="contained" onClick={handleCLose}>
              Cerrar
            </Button>
            <Button
              variant="contained"
              disabled={
                state.invoice.nullingForm.confirm !== 'Confirmar' ||
                !state.invoice.nullingForm.reason
              }
              type="submit">
              Anular
            </Button>
          </Box>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default NullifyInvoice
