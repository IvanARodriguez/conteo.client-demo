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

type DialogProps = {
  question: string
  advice: string
  type: 'confirm' | 'delete' | 'annulate' | 'edit' | 'create' | 'continue'
  handleConfirm?: () => void
  open: boolean
}

export default function ConfirmationDialog(props: DialogProps) {
  const state = store.useState()
  const actions = store.useActions()
  const [confirm, setConfirm] = React.useState('')
  const translate = dictionary[state.application.language]
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClose = () => {
    actions.application.setConfirmationModal()
  }

  return (
    <Dialog
      onSubmit={e => {
        e.preventDefault()
        if (props.handleConfirm) {
          console.log('Deleting')
          props.handleConfirm()
        }
        setConfirm('')
      }}
      component="form"
      sx={{
        zIndex: state.application.confirmationOpen ? 70000 : -1,
        display: state.application.confirmationOpen ? 'initial' : 'none',
      }}
      fullScreen={fullScreen}
      open={props.open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title">
      <DialogTitle variant="h5" id="responsive-dialog-title">
        {props.question}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.3rem',
        }}>
        <DialogContentText>{props.advice}</DialogContentText>

        <TextField
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
          loading={state.product.loadingProduct}
          disabled={confirm === '' || confirm !== 'Confirmar'}
          sx={{
            ':disabled': {
              backgroundColor: `${grey[500]}`,
              color: grey[800],
            },
            backgroundColor:
              props.type === 'delete' ? red[500] : theme.palette.primary.main,
            color: 'white',
            ':hover': {
              backgroundColor: props.type === 'delete' ? red[500] : undefined,
            },
          }}
          autoFocus>
          {translate.buttonAction[props.type]}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
