import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Box, TextField } from '@mui/material'
import { grey, red } from '@mui/material/colors'
import { store } from '../../utils'
import { dictionary } from '../../utils/dictionary'
import { LoadingButton } from '@mui/lab'

export default function CustomerDeactivationModal() {
  const state = store.useState()
  const actions = store.useActions()
  const [confirm, setConfirm] = React.useState('')
  const translate = dictionary[state.application.language]
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClose = () => {
    actions.customer.setActivationModal()
  }

  return (
    <Dialog
      onSubmit={e => {
        e.preventDefault()
        actions.customer.changeActiveStatus({ activeStatus: false })
        setConfirm('')
      }}
      component="form"
      fullScreen={fullScreen}
      open={state.customer.activationConfirmationModal}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title">
      <DialogTitle variant="h5" id="responsive-dialog-title">
        Seguro que desea desactivar el cliente?
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.3rem',
        }}>
        <DialogContentText>
          Después de la desactivación el cliente no estará disponible para
          elección
        </DialogContentText>

        <TextField
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          error={confirm === '' || confirm !== 'Confirmar'}
          id="confirm-Input"
          fullWidth
          label='Escriba "Confirmar"'
          maxRows={4}
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton
          type="submit"
          loading={state.customer.loadingData}
          disabled={confirm === '' || confirm !== 'Confirmar'}
          sx={{
            ':disabled': {
              backgroundColor: `${grey[500]}`,
              color: grey[800],
            },
          }}
          autoFocus>
          Desactivar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
