import { store } from '@/utils'
import { createTheme } from '@mui/material/styles'

const createCustomTheme = () => {
  const state = store.useState()
  const userTheme = state.profile.setting.theme
  const mode = userTheme === 'light' ? 'light' : 'dark'
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#1993d0',
      },
      secondary: {
        main: '#73cb42',
      },
    },
  })
}

export default createCustomTheme
