import CropEasy from '@/components/cropper/crop-easy'
import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import React, { useEffect, useState } from 'react'
import { Crop, Update } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const UserProfile = () => {
  const state = store.useState()
  const actions = store.useActions()
  const currentUser = state.profile
  const [file, setFile] = useState<Blob | null>(null)
  const [photoURL, setPhotoURL] = useState(currentUser?.setting.image)
  const [openCrop, setOpenCrop] = useState(false)

  const dataHasChanged =
    currentUser.username !== state.profile.updateForm.username ||
    currentUser.role !== state.profile.updateForm.role ||
    currentUser.setting.theme !== state.profile.updateForm.theme ||
    // state.profile.updateForm.password
    file !== null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      setFile(file)
      setPhotoURL(URL.createObjectURL(file))
      setOpenCrop(true)
      console.log(URL.createObjectURL(file))
    }
  }

  function updateProfile() {
    actions.profile.updateProfile(file)
  }

  function setTheme() {
    actions.profile.setTheme()
  }
  useEffect(() => {
    actions.profile.setUpdateFormValue({
      field: 'username',
      value: currentUser.username,
    })
    actions.profile.setUpdateFormValue({
      field: 'role',
      value: currentUser.role,
    })
  }, [])

  return (
    <MainView>
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          py: '2rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}>
        <Box
          position={'relative'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}>
          <IconButton component="label" sx={{ width: 'fit-content' }}>
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              id="profilePhoto"
              onChange={handleChange}
            />
            <Box sx={{ position: 'relative' }}>
              {photoURL ? (
                <Avatar
                  sx={{ width: '150px', height: '150px', fontSize: '4rem' }}
                  src={`${photoURL}`}
                  key={state.profile.imageRenderingKey}
                  alt={currentUser.username + ' picture'}
                />
              ) : (
                <Avatar
                  sx={{ width: '150px', height: '150px', fontSize: '4rem' }}>
                  <CameraAltIcon sx={{ fontSize: '3rem' }} />
                </Avatar>
              )}
              {file && (
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, left: '150px' }}
                  aria-label="Crop"
                  color="primary"
                  onClick={() => setOpenCrop(true)}>
                  <Crop />
                </IconButton>
              )}
            </Box>
          </IconButton>
        </Box>
        <TextField
          label={'Nombre de Usuario'}
          variant="filled"
          value={state.profile.updateForm.username}
          onChange={e =>
            actions.profile.setUpdateFormValue({
              field: 'username',
              value: e.target.value,
            })
          }
        />
        <TextField
          autoComplete="new-password"
          label={'Nueva Contraseña'}
          type="password"
          name="new-password-field"
          variant="filled"
          value={state.profile.updateForm.password}
          onChange={e =>
            actions.profile.setUpdateFormValue({
              field: 'password',
              value: e.target.value,
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="tipo de empleado">Tipo de empleado</InputLabel>
          <Select
            disabled={currentUser.role === 'EMPLOYEE'}
            onChange={(e, value) =>
              actions.profile.setUpdateFormValue({
                field: 'role',
                value: e.target.value,
              })
            }
            size="medium"
            labelId="tipo de empleado"
            id="tipo de empleado"
            value={state.profile.updateForm.role}
            label={'Tipo de usuario'}>
            <MenuItem value={'ADMIN'}>Administrador</MenuItem>
            <MenuItem value={'EMPLOYEE'}>Empleado</MenuItem>
          </Select>
        </FormControl>
        <ButtonGroup
          sx={{ width: 'fit-content' }}
          variant="contained"
          aria-label="plain button group">
          <LoadingButton
            loading={state.profile.updatingUserData}
            onClick={setTheme}
            disabled={state.profile.setting.theme === 'light'}>
            light
          </LoadingButton>
          <LoadingButton
            loading={state.profile.updatingUserData}
            disabled={state.profile.setting.theme === 'dark'}
            onClick={setTheme}>
            dark
          </LoadingButton>
        </ButtonGroup>
        <LoadingButton
          loading={state.profile.updatingUserData}
          disabled={!dataHasChanged}
          variant="contained"
          onClick={updateProfile}
          startIcon={<Update />}>
          Actualizar
        </LoadingButton>
      </Box>
      {openCrop ? (
        <Dialog open={openCrop}>
          <CropEasy {...{ photoURL, setOpenCrop, setFile, setPhotoURL }} />
        </Dialog>
      ) : (
        ''
      )}
    </MainView>
  )
}

export default UserProfile
