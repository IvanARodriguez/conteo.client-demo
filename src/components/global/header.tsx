import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import * as store from '../../store'
import ConteoLogo from '../../assets/conteo-logo'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'

const Header = () => {
  const actions = store.useActions()
  const state = store.useState()
  const theme = useTheme()
  function handleClick() {
    actions.application.setMenuOpen()
  }
  return (
    <AppBar
      color={theme.palette.mode === 'light' ? 'transparent' : 'default'}
      position="static"
      elevation={1}
      sx={{
        zIndex: 500,
        gridColumn: 'span 2',
      }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minWidth: '100vw',
        }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            placeItems: 'center',
            gap: '.5rem',
          }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              display: { xs: 'none', sm: 'flex' },
            }}
            onClick={() => actions.application.setUseNarrowedMenu()}>
            {state.application.useNarrowedMenu ? (
              <MenuIcon />
            ) : (
              <MenuOpenIcon />
            )}
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              gap: '.5rem',
              placeItems: 'center',
              placeContent: { sm: 'center' },
            }}>
            <ConteoLogo height={40} width={40} />
            <Box display={'grid'}>
              <Typography variant="h6" color="inherit" component="div">
                Conteo
              </Typography>
              <Typography
                sx={{ gridColumn: 'span 2' }}
                variant="caption"
                color={theme.palette.grey[500]}>
                {state.business.business && state.business.business.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton
          sx={{ display: { sx: 'block', sm: 'none' } }}
          onClick={handleClick}
          color="inherit"
          aria-label="menu button">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
export default Header
