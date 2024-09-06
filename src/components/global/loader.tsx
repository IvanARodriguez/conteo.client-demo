import { Box, useTheme } from '@mui/material'
import { dictionary } from '../../utils/dictionary'
import LogoLoader from '../../assets/logo-loader'

function Loader() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 5000,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        minHeight: '100vh',
        minWidth: '100vw',
        background: theme.palette.background.default,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8.3px)',
        webkitBackdropFilter: 'blur(8.3px)',
        border: '1px solid rgba(41, 41, 41, 0.47)',
        display: 'grid',
        placeItems: 'center',
        placeContent: 'center',
        gap: '3rem',
      }}>
      <LogoLoader />
    </Box>
  )
}

export default Loader
