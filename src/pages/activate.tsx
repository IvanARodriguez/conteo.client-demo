import MainView from '@/components/global/main-view'
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useLocation, useParams } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { green, grey, red } from '@mui/material/colors'
import React from 'react'
import { store } from '@/utils'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { enqueueSnackbar } from 'notistack'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function Activate() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const query = useQuery()
  const { isActivated, activationForm } = store.useState().registration
  const { admin, tax, business, isLoading } = activationForm
  const registration = store.useActions().registration

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(show => !show)

  function handleUsername(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const username = e.target.value
    registration.setUsername(username)

    let error = ''

    if (!username) {
      error = 'Debe proveer usuario'
    } else if (username.length < 6) {
      error = 'Usuario debe tener al menos 6 caracteres'
    } else if (username.length > 25) {
      error = 'Usuario debe tener no mas de 25 caracteres'
    }

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.username = error
      } else {
        delete newErrors.username
      }
      return newErrors
    })
  }

  function handlePassword(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const password = e.target.value
    registration.setPassword(password)

    let error = ''

    if (!password) {
      error = 'Debe proveer una contraseña'
    } else if (password.length < 8) {
      error = 'La contraseña debe tener al menos 8 caracteres'
    } else if (!/[A-Z]/.test(password)) {
      error = 'La contraseña debe tener al menos una letra mayúscula'
    } else if (!/[a-z]/.test(password)) {
      error = 'La contraseña debe tener al menos una letra minúscula'
    } else if (!/[0-9]/.test(password)) {
      error = 'La contraseña debe tener al menos un número'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      error = 'La contraseña debe tener al menos un carácter especial'
    }

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.password = error
      } else {
        delete newErrors.password
      }
      return newErrors
    })
  }

  function handleConfirmPassword(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const password = e.target.value
    registration.setConfirmPassword(password)

    let error = ''

    if (!password) {
      error = 'Debe confirmar contraseña'
    } else if (password != admin.password) {
      error = 'Debe ser igual a la contraseña'
    }

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.confirmPassword = error
      } else {
        delete newErrors.confirmPassword
      }
      return newErrors
    })
  }

  function getNumberFromInput(n: string) {
    if (Number.isInteger(Number.parseInt(n))) {
      return Number.parseInt(n)
    }
    return 0
  }

  function handleRNC(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    // remove dashes
    const value = e.target.value.replace('-', '')
    registration.setBusinessRNC(getNumberFromInput(value))
    let error = ''
    if (value.length !== 9) {
      error = 'RNC debe contener 9 dígitos'
    }
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.rnc = error
      } else {
        delete newErrors.rnc
      }
      return newErrors
    })
  }

  function handlePhone(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    // remove dashes
    const value = e.target.value.replace('-', '')
    registration.setBusinessPhone(value)
    let error = ''
    if (value.length > 20) {
      error = 'Teléfono debe ser menos de 20 dígitos'
    }
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.phone = error
      } else {
        delete newErrors.phone
      }
      return newErrors
    })
    return getNumberFromInput(value)
  }

  function handleEmail(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const email = e.target.value
    registration.setBusinessEmail(email)

    let error = ''

    if (!email) {
      error = ''
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      error = 'Debe proveer un email válido'
    }

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      if (error) {
        newErrors.email = error
      } else {
        delete newErrors.email
      }
      return newErrors
    })
  }

  function handleDialog() {
    if (!admin.username) errors.username = 'Falta usuario administrador'
    if (!admin.password) errors.username = 'Debe proveer contraseña'
    if (!admin.confirmPassword)
      errors.confirmPassword = 'Debe comprobar la contraseña'
    if (admin.password !== admin.confirmPassword)
      errors.confirmPassword = 'Contraseña y confirmación deben ser iguales'

    if (Object.keys(errors).length > 0) {
      setDialogOpen(false)
      return enqueueSnackbar('No se pudo someter debido a algunos errores', {
        variant: 'error',
      })
    }
    setDialogOpen(!dialogOpen)
  }

  async function handleSubmit() {
    registration.setIsLoading(true)
    if (!admin.username) errors.username = 'Falta usuario administrador'
    if (!admin.password) errors.username = 'Debe proveer contraseña'
    if (!admin.confirmPassword)
      errors.confirmPassword = 'Debe comprobar la contraseña'
    if (admin.password !== admin.confirmPassword)
      errors.confirmPassword = 'Contraseña y confirmación deben ser iguales'

    if (Object.keys(errors).length > 0) {
      registration.setIsLoading(false)
      return enqueueSnackbar('No se pudo someter debido a algunos errores', {
        variant: 'error',
      })
    }
    await registration.activateAccount(query.get('token') ?? '')
    registration.setIsLoading(false)
  }

  return (
    <>
      {isActivated ? (
        <ActivationCompletedView />
      ) : (
        <Box
          id="div1"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            gap: '1rem',
            justifyContent: 'start',
            alignItems: 'center',
            p: '5rem 1rem 1rem 1rem',
          }}>
          <Typography variant="h3">Formulario de activación</Typography>
          <Typography sx={{ maxWidth: '600px' }}>
            Por favor llene el siguiente formulario para activar la cuenta, los
            campos con asteriscos &lsquo;*&rsquo; son obligatorios
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'grid',
              width: '100%',
              margin: '1rem auto ',
              maxWidth: '600px',
              gap: '1rem',
            }}>
            <Typography>Administrador</Typography>
            <Divider />
            <TextField
              size="small"
              autoComplete="off"
              value={admin.username}
              onChange={handleUsername}
              type="text"
              fullWidth
              error={errors.username != null}
              helperText={
                errors.username ?? 'Nombre de usuario de administrador'
              }
              label="Usuario *"
            />
            <FormControl variant="outlined">
              <InputLabel
                error={errors.password != null}
                size="small"
                htmlFor="Contraseña">
                Contraseña *
              </InputLabel>
              <OutlinedInput
                size="small"
                id="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                value={admin.password}
                onChange={handlePassword}
                error={errors.password != null}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography
                sx={{
                  color: errors.password ? red[500] : grey[200],
                  pl: '1rem',
                }}
                variant="caption">
                {errors.password ?? 'Contraseña de usuario de administrador'}
              </Typography>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel
                error={errors.confirmPassword != null}
                size="small"
                htmlFor="confirm">
                Confirmar Contraseña *
              </InputLabel>
              <OutlinedInput
                size="small"
                id="confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="off"
                value={admin.confirmPassword}
                onChange={handleConfirmPassword}
                error={errors.confirmPassword != null}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography
                sx={{
                  color: errors.confirmPassword ? red[500] : grey[200],
                  pl: '1rem',
                }}
                variant="caption">
                {errors.confirmPassword ??
                  'Contraseña de usuario de administrador'}
              </Typography>
            </FormControl>

            <Typography variant="h6">Empresa</Typography>
            <Typography color={'gray'}>
              Esta información es util para generar facturas
            </Typography>
            <Divider />
            <TextField
              size="small"
              value={business.name}
              onChange={e => registration.setBusinessName(e.target.value)}
              autoComplete="off"
              type="text"
              fullWidth
              label="Nombre de empresa"
            />
            <TextField
              value={business.address}
              size="small"
              onChange={e => registration.setBusinessAddress(e.target.value)}
              autoComplete="off"
              type="text"
              fullWidth
              label="Dirección"
            />
            <TextField
              value={business.rnc}
              size="small"
              onChange={handleRNC}
              error={errors.rnc !== undefined}
              helperText={errors.rnc ?? undefined}
              autoComplete="off"
              type="number"
              fullWidth
              label="RNC"
            />
            <TextField
              size="small"
              value={business.phone}
              onChange={handlePhone}
              error={errors.phone !== undefined}
              helperText={errors.phone ?? undefined}
              autoComplete="off"
              type="number"
              fullWidth
              label="Teléfono"
            />
            <TextField
              size="small"
              onChange={handleEmail}
              error={errors.email !== undefined}
              helperText={errors.email ?? undefined}
              autoComplete="off"
              type="email"
              fullWidth
              label="Email"
            />
            <Typography variant="h6">
              Configuración de Comprobantes Fiscales
            </Typography>
            <Typography color={'gray'}>
              Esta información es util para que el sistema tenga una referencia
              de el proximo numero de comprobante fiscal de cada categoría para
              las facturas de clientes que requieren comprobante fiscal.
            </Typography>
            <Divider />
            <TextField
              size="small"
              autoComplete="off"
              type="number"
              fullWidth
              helperText="Valido para crédito fiscal"
              label="B01"
              value={tax.B01 || ''}
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB01(num)
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              value={tax.B02 || ''}
              type="number"
              fullWidth
              helperText="Consumidor final"
              label="B02"
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB02(num)
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              value={tax.B04 || ''}
              type="number"
              fullWidth
              helperText="Notas de crédito"
              label="B04"
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB04(num)
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              value={tax.B14 || ''}
              type="number"
              fullWidth
              helperText="Regimen especial"
              label="B14"
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB14(num)
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              value={tax.B15 || ''}
              type="number"
              fullWidth
              helperText="Comprobante gubernamental"
              label="B15"
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB15(num)
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              value={tax.B16 || ''}
              type="number"
              fullWidth
              helperText="Exportaciones"
              label="B16"
              onChange={e => {
                const num = getNumberFromInput(e.target.value)
                registration.setTaxB16(num)
              }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{ width: 'fit-content' }}
              disabled={Object.keys(errors).length > 0}
              type="button"
              onClick={handleDialog}>
              Someter
            </Button>

            <Dialog onClose={handleDialog} open={dialogOpen}>
              <Paper
                sx={{
                  maxWidth: '500px',
                  p: '1rem',
                  display: 'grid',
                  gap: '1rem',
                }}>
                <Typography variant="h5">Activar Cuenta?</Typography>
                <Typography>
                  Guarde bien la contraseña, ya que solo desde dentro del portal
                  se puede cambiar.
                </Typography>
                <LoadingButton
                  loading={isLoading}
                  type="button"
                  onClick={handleSubmit}
                  size="small"
                  variant="contained"
                  sx={{ width: 'fit-content' }}>
                  Activar Cuenta
                </LoadingButton>
              </Paper>
            </Dialog>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Activate

function ActivationCompletedView() {
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(event => {
      setWidth(event[0].contentBoxSize[0].inlineSize)
      setHeight(event[0].contentBoxSize[0].blockSize)
    })
    resizeObserver.observe(document.getElementById('div1') as Element)
  }, [])
  return (
    <Box
      id="div1"
      sx={{
        minWidth: '100vw',
        minHeight: '100vh',
      }}>
      <Confetti width={width} height={height} recycle={false} />
      <Box
        sx={{
          maxWidth: '500px',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          placeContent: 'center',
          textAlign: 'center',
        }}>
        <CheckCircleIcon
          sx={{ width: '130px', height: '130px', color: green[700] }}
        />
        <Typography variant="h6">
          Formulario recibido, favor contactar un administrador de Conteo para
          activar la cuenta
        </Typography>
      </Box>
    </Box>
  )
}
