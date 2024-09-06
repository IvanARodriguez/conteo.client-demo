import { store } from '@/utils'
import { PersonAdd, Settings, Logout } from '@mui/icons-material'
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  ListItem,
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import ImageComponent from '../image-component'
import BadgeIcon from '@mui/icons-material/Badge'

export default function AccountMenu() {
  const state = store.useState()
  const actions = store.useActions()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
        }}>
        <Tooltip title="Administrar cuenta">
          <ListItemButton
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            sx={{ gap: '2rem' }}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}>
            <ImageComponent
              size={25}
              imgSrc={state.profile.setting.image}
              variant={'circular'}
              alt="User Profile Image"
            />
            <ListItemText>Administrar</ListItemText>
          </ListItemButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}>
        <Link to={'/users/profile'}>
          <MenuItem
            sx={{ display: 'flex', gap: '.5rem', pb: '.5rem' }}
            onClick={handleClose}>
            <Typography> Mi Cuenta</Typography>
          </MenuItem>
        </Link>
        <Divider />
        {state.profile.role === 'ADMIN' ? (
          <Box>
            <MenuItem
              onClick={() => {
                handleClose
              }}>
              <Link to={'/users'}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Administrar Usuarios
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose
              }}>
              <Link to={'/vendors'}>
                <ListItemIcon>
                  <BadgeIcon fontSize="small" />
                </ListItemIcon>
                Administrar Vendedores
              </Link>
            </MenuItem>
          </Box>
        ) : null}
        <Link to={'/business'}>
          <MenuItem
            sx={{ display: state.profile.role === 'ADMIN' ? 'block' : 'none' }}
            onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Configuración
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            actions.application.logout()
            handleClose
          }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Salir
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
