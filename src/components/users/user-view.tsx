import { store } from '@/utils'
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  Divider,
  Typography,
} from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import React from 'react'

function UserView() {
  const state = store.useState()
  const actions = store.useActions()
  const userById = state.users.userById
  function handleClose() {
    actions.users.setUserViewModal()
  }
  if (state.users.loadingUserData) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={state.users.loadingUserData}>
        <CircularProgress />
      </Backdrop>
    )
  }
  return (
    <Dialog
      key={'user-view'}
      open={state.users.viewUserOpen}
      onClose={handleClose}>
      <Box
        display={'flex'}
        gap={'2rem'}
        padding={'2rem'}
        justifyContent={'center'}
        flexWrap={'wrap'}
        alignItems={'center'}>
        <Avatar
          sx={{
            bgcolor: deepOrange[500],
            minWidth: '100px',
            minHeight: '100px',
            fontSize: '4rem',
            mb: { xs: '2rem', sm: '0' },
          }}>
          {userById.setting.image ? (
            <img src={`${userById.setting.image}`} height={'100%'} />
          ) : (
            'U'
          )}
        </Avatar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: { xs: '100%', sm: 'auto' },
          }}>
          <Typography variant="h5">
            {userById.username || 'Usuario indefinido'}
          </Typography>
          <Divider />
          <Box
            display={'grid'}
            sx={{
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: { xs: '.5rem' },
            }}>
            <Typography variant="caption">Tipo de Usuario</Typography>
            <Typography variant="caption" color={'primary'}>
              {userById.role}
            </Typography>
            <Typography variant="caption">Creado</Typography>
            <Typography variant="caption" color={'primary'}>
              {new Date(userById.createdAt).toLocaleString('es-DO')}
            </Typography>
            <Typography variant="caption">Actualizado</Typography>
            <Typography variant="caption" color={'primary'}>
              {new Date(userById.updatedAt).toLocaleString('es-DO')}
            </Typography>
            <Typography variant="caption">Imagen</Typography>
            <Typography variant="caption" color={'primary'}>
              {userById.setting.image || 'No definido'}
            </Typography>
            <Typography variant="caption">Estilo Preferido</Typography>
            <Typography variant="caption" color={'primary'}>
              {userById.setting.theme || 'No definido'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default UserView
