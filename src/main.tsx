import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'overmind-react'
import { createOvermind } from 'overmind'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { overmindConfig } from './store'
import './index.css'
import CustomNotification from './components/global/custom-notification'
import App from './app'
import createCustomTheme from './config/theme'

const overmind = createOvermind(overmindConfig, {
  devtools:
    process.env.NODE_ENV === 'development' ? 'localhost:3031' : undefined,
  name: 'Conteo',
  delimiter: '👌',
})

function Providers(props: { children: React.ReactNode }) {
  useEffect(() => {
    const loader = document.getElementById('app')
    loader ? (loader.style.display = 'none') : ''
  }, [])
  return (
    <Provider value={overmind}>
      <CustomNotification>
        <Box>{props.children}</Box>
      </CustomNotification>
    </Provider>
  )
}

function CustomThemeProvider(props: { children: React.ReactNode }) {
  const theme = createCustomTheme()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  )
}

let container: any = null
document.addEventListener('DOMContentLoaded', e => {
  if (!container) {
    container = document.getElementById('root') as HTMLElement
    const root = createRoot(container)

    root.render(
      <React.StrictMode>
        <Providers>
          <CustomThemeProvider>
            <App />
          </CustomThemeProvider>
        </Providers>
      </React.StrictMode>,
    )
  }
})
