import { setConfirmPassword } from '@/store/users/actions'
import { store } from '@/utils'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FilledInput,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
  FormHelperText,
  OutlinedInput,
  useTheme,
} from '@mui/material'
import { grey, red } from '@mui/material/colors'
import { useState } from 'react'
import ConfirmationDialog from '../global/confirmation-dialog'

function CreateUserModal() {
  const state = store.useState()
  const actions = store.useActions()
  const [showPassword, setShowPassword] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(true)
  const theme = useTheme()
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleShowPassword() {
    setShowPassword(!showPassword)
  }
  function handleShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }
  const isInvalidPassword =
    state.users.userFormState.password !== '' &&
    state.users.userFormState.confirmPassword !== '' &&
    !state.users.userFormState.passwordMatched

  function handleClose() {
    actions.users.setFormUsername('')
    actions.users.setConfirmPassword('')
    actions.users.setRole('EMPLOYEE')
    actions.users.setPassword('')
    actions.users.setDialogOpen()
  }
  function handleCreate() {}
  return (
    <Dialog
      key={'create-user-dialog'}
      onClose={handleClose}
      open={state.users.createModalOpen || false}>
      <DialogTitle textAlign="center">Agregar Usuario</DialogTitle>
      <DialogContent>
        <form onSubmit={e => e.preventDefault()}>
          <Stack
            sx={{
              pt: '1.5rem',
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}>
            <TextField
              value={state.users.userFormState.username || undefined}
              label={'Usuario'}
              name="Usuario"
              onChange={e => actions.users.setFormUsername(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="role-selection">Tipo</InputLabel>
              <Select
                defaultValue="EMPLOYEE"
                labelId="role-selection"
                onChange={e =>
                  actions.users.setRole(e.target.value as 'ADMIN' | 'EMPLOYEE')
                }
                id="demo-simple-select"
                value={state.users.userFormState.role}
                label="Tipo">
                <MenuItem value={'ADMIN'}>Administrador</MenuItem>
                <MenuItem value={'EMPLOYEE'}>Estándar</MenuItem>
              </Select>
            </FormControl>
            <FormControl error={isInvalidPassword}>
              <InputLabel htmlFor="show-user-password">Contraseña</InputLabel>
              <FilledInput
                key={'show-user-password'}
                onChange={e => actions.users.setConfirmPassword(e.target.value)}
                id="show-user-password"
                type={showPassword ? 'text' : 'password'}
                error={isInvalidPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      key={'password'}
                      onClick={handleShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText
                sx={{
                  ml: 0,
                  display: isInvalidPassword ? 'block' : 'none',
                }}>
                Contraseñas deben ser iguales
              </FormHelperText>
            </FormControl>
            <FormControl error={isInvalidPassword}>
              <InputLabel htmlFor="show-confirm-password">
                Confirmar Contraseña
              </InputLabel>
              <FilledInput
                key={'Confirm-password'}
                onChange={e => actions.users.setPassword(e.target.value)}
                id="show-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={isInvalidPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      key={'confirm password'}
                      aria-label="toggle password visibility"
                      onClick={handleShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText
                sx={{
                  ml: 0,
                  color: red[500],
                  display: isInvalidPassword ? 'block' : 'none',
                }}>
                Contraseñas deben ser iguales
              </FormHelperText>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <LoadingButton
          loading={state.application.isLoading}
          onClick={() => actions.users.createUser()}
          disabled={
            isInvalidPassword ||
            state.users.userFormState.username === '' ||
            state.users.userFormState.password === '' ||
            state.users.userFormState.confirmPassword === ''
          }
          color="primary"
          variant="contained">
          Crear
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default CreateUserModal
