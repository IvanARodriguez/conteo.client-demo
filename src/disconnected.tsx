import React, { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import CustomNotification from '@/components/global/custom-notification'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import createCustomTheme from '@/config/theme'
import { Provider } from 'overmind-react'
import { createOvermind } from 'overmind'
import { overmindConfig } from './store'
const overmind = createOvermind(overmindConfig, {
  devtools:
    process.env.NODE_ENV === 'development' ? 'localhost:3031' : undefined,
  name: 'Conteo',
  delimiter: '👌',
})
function InitialLoad(props: { children: ReactNode }) {
  const { children } = props
  const theme = createCustomTheme()
  useEffect(() => {
    const loader = document.getElementById('app')
    loader ? (loader.style.display = 'none') : ''
  }, [])
  return (
    <Provider value={overmind}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CustomNotification>
          <Box>{children}</Box>
        </CustomNotification>
      </ThemeProvider>
    </Provider>
  )
}

let container = null

document.addEventListener('DOMContentLoaded', function (event) {
  container = document.getElementById('disconnected-root') as HTMLElement
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <InitialLoad>
        <BrowserRouter>
          <Routes>
            <Route path="/disconnected" element={<DatabaseDisconnected />} />
          </Routes>
        </BrowserRouter>
      </InitialLoad>
    </React.StrictMode>,
  )
})

function DatabaseDisconnected() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '99vh',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        textAlign: 'center',
      }}>
      <Box>
        <img style={{ maxHeight: '300px' }} src={'/server-connection.svg'} />
      </Box>
      <Typography variant="h5">
        No se pudo establecer una conexión con la base de datos, contacte a un
        administrador.
      </Typography>
    </Box>
  )
}
