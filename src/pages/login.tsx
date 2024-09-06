import { VisibilityOff, Visibility, BusinessCenter } from '@mui/icons-material'
import {
  FormGroup,
  Box,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useLayoutEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { LoadingButton } from '@mui/lab'
import { dictionary } from '@/utils/dictionary'
import * as store from '@/store'
import Loader from '@/components/global/loader'
import styled from '@emotion/styled'
import LoginBanner from '@/assets/login-banner'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Login() {
  const state = store.useState()
  if (state.application.isLoading) return <Loader />

  return (
    <Box
      sx={{
        display: 'grid',
        minHeight: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}>
      <LoginBanner />
      <LoginForm />
    </Box>
  )
}

export default Login

function LoginForm() {
  const actions = store.useActions()
  const state = store.useState()
  const translations = dictionary[state.application.language ?? 'es']
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  if (state.application.isLoading) return <Loader />

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await actions.application.login()
  }
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'inherit',
        justifyContent: 'center',
        gap: '3rem',
        backgroundColor:
          theme.palette.mode === 'dark' ? '#082e42' : '#92bbd1a2',
      }}>
      <LoginHeading>Bienvenido!</LoginHeading>
      <Box
        component="form"
        sx={{
          placeContent: 'center',
          display: 'grid',
          gap: '1.5rem',
          width: '100%',
        }}
        onSubmit={handleFormSubmit}>
        <FormGroup
          sx={{
            width: '100%',
            minWidth: { sm: '320px' },
            maxWidth: { sm: '500px' },
            display: 'grid',
            gap: '1.3rem',
          }}>
          <FormControl>
            <InputLabel htmlFor="tenant">Proveedor</InputLabel>
            <FilledInput
              id="tenant"
              required
              type={'text'}
              key={'tenant'}
              value={state.application.login.tenant}
              onChange={event =>
                actions.application.setTenant(event.target.value)
              }
              endAdornment={
                <InputAdornment position="end">
                  <BusinessCenter />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="username">
              {translations.username ?? 'Username'}
            </InputLabel>
            <FilledInput
              id="username"
              type={'text'}
              key={'username'}
              value={state.application.login.username}
              onChange={event =>
                actions.application.setUsername(event.target.value)
              }
              endAdornment={
                <InputAdornment position="end">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="filled-adornment-password">
              {translations.password ?? 'Password'}
            </InputLabel>
            <FilledInput
              key={'password'}
              onChange={e => actions.application.setPassword(e.target.value)}
              id="filled-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <LoadingButton
            type="submit"
            loading={state.application.isLoading}
            fullWidth
            variant="contained">
            {translations.login}
          </LoadingButton>
          <Box sx={{ display: 'flex', gap: '.3rem' }}>
            <Typography>Nuevo en conteo?</Typography>
            <Link to="/register">
              <Box sx={{ textDecoration: 'underline' }}>crear una cuenta</Box>
            </Link>
          </Box>
          <Typography
            paddingBottom={'3rem'}
            variant="caption"
            alignSelf={'end'}
            pb={'1rem'}>
            {translations.legal}
          </Typography>
        </FormGroup>
      </Box>
    </Box>
  )
}

const LoginHeading = styled.h1`
  font-family: 'Playwrite GB S';
  font-size: 3rem;
`
