import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import { LoadingButton } from '@mui/lab'
import { Box, Paper, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { green } from '@mui/material/colors'
import ConteoLogo from '@/assets/conteo-logo'

function Register() {
  const theme = useTheme()
  const actions = store.useActions()
  const [tenantName, setTenantName] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [billingAddress, setAddress] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handleAddress(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setAddress(e.target.value)
    const newErrors = { ...errors }
    if (!billingAddress) {
      newErrors.address = 'La dirección es requerida'
      setErrors(newErrors)
      return
    } else {
      delete newErrors.address
      setErrors(newErrors)
    }
  }

  function handleEmail(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEmail(e.target.value)
    const newErrors = { ...errors }
    if (!email) {
      newErrors.email = 'Email es requerido'
      setErrors(newErrors)
      return
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = 'Debe proveer un email válido'
      setErrors(newErrors)
      return
    }
    delete newErrors.email
    setErrors(newErrors)
  }

  function handleTenantName(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value: string = e.target.value
    const newErrors = { ...errors }
    setTenantName(value)
    if (!value) {
      newErrors.tenant = 'Debe proveer el nombre de proveedor'
      setErrors(newErrors)
      return
    }
    const regex = /^[a-z]{3,20}$/

    if (regex.test(value) === false) {
      newErrors.tenant =
        'Nombre de proveedor debe ser en minúscula, y entre 6-20 caracteres'
      setErrors(newErrors)
      return
    }

    delete newErrors.tenant
    setErrors(newErrors)
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const response = await actions.registration.createTenant({
      billingAddress,
      email,
      tenantName,
    })
    setSuccess(response.success)
    setLoading(false)
  }

  if (success) {
    return <SuccessfulRegistrationView />
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
      <Box
        sx={{
          display: 'grid',
          p: '1rem',
          gridTemplateColumns: { md: '400px 1fr' },
          maxWidth: '1024px',
          height: '100%',
          width: '100%',
          m: '0 auto',
        }}>
        <Box
          sx={{
            position: 'relative',
            display: { sm: 'none', md: 'block' },
            height: '100vh',
            maxHeight: '600px',
            width: '100%',
            overflow: 'hidden',
            borderRadius: '1rem 0 0 1rem',
          }}>
          <Box
            component={'img'}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              objectFit: 'cover',
            }}
            src="register-image.webp"
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              opacity: 0.7,
              background:
                'linear-gradient(180deg, rgba(0,45,204,1) 0%, rgba(0,134,27,1) 51%, rgba(19,126,230,1) 100%)',
            }}></Box>
        </Box>
        <Paper
          onSubmit={e => handleSubmit(e)}
          component={'form'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            borderRadius: '0 1rem 1rem 0',
            p: '2rem',
          }}>
          <ConteoLogo />
          <Typography variant="h5">Registrar en Conteo</Typography>
          <TextField
            fullWidth
            value={tenantName}
            error={errors.tenant !== undefined}
            helperText={errors.tenant}
            onChange={handleTenantName}
            size="small"
            label={'Nombre de proveedor'}
          />
          <TextField
            fullWidth
            value={email}
            error={errors.email !== undefined}
            helperText={errors.email}
            onChange={handleEmail}
            size="small"
            label={'Email'}
          />
          <TextField
            value={billingAddress}
            error={errors.address !== undefined}
            helperText={errors.address}
            onChange={handleAddress}
            size="small"
            fullWidth
            label={'Dirección'}
          />
          <LoadingButton
            loading={loading}
            disabled={
              Object.keys(errors).length !== 0 ||
              !email ||
              !tenantName ||
              !billingAddress
            }
            variant="contained"
            type="submit"
            size="small">
            Crear
          </LoadingButton>
          <Box
            sx={{
              display: 'flex',
              gap: '.5rem',
              justifyContent: 'start',
              alignItems: 'center',
            }}>
            <Typography variant="body2">Ya tengo una cuenta </Typography>
            <Link to="/login">
              <Typography
                variant={'body2'}
                sx={{ color: theme.palette.info.main }}>
                login
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Register

function SuccessfulRegistrationView() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
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
          sx={{ width: '100px', height: '100px', color: green[700] }}
        />
        <Typography variant="h6">
          Hemos recibido la solicitud, le enviaremos un correo para completar el
          registro
        </Typography>
      </Box>
    </Box>
  )
}
