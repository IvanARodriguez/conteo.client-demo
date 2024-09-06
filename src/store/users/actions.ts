import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'

export function setFormUsername({ state }: Context, newValue: string) {
  state.users.userFormState.username = newValue
}

export function setPassword({ state }: Context, newValue: string) {
  state.users.userFormState.password = newValue
}
export function setConfirmPassword({ state }: Context, newValue: string) {
  state.users.userFormState.confirmPassword = newValue
}
export function setRole({ state }: Context, newValue: 'ADMIN' | 'EMPLOYEE') {
  state.users.userFormState.role = newValue
}

export function setDialogOpen({ state }: Context) {
  state.users.createModalOpen = !state.users.createModalOpen
}

export async function getUsers({ effects, state, actions }: Context) {
  actions.users.isLoadingData(true)
  const dbResponse = await effects.users.getUsers()
  if (isErrorResponse(dbResponse)) {
    const errorMessage =
      (dbResponse as any).detail ?? 'Servidor respondió con error fatal 500'
    actions.users.isLoadingData(false)
    enqueueSnackbar(errorMessage, { variant: 'error' })
    return
  }
  actions.users.isLoadingData(false)
  state.users.usersData = dbResponse
}

export function isLoadingData({ state }: Context, isLoading: boolean) {
  state.users.isLoadingData = isLoading
}

export function setId({ state }: Context, id: string) {
  state.users.userFormState.id = id
}

export async function createUser({ state, effects, actions }: Context) {
  const username = state.users.userFormState.username
  const password = state.users.userFormState.password
  const confirmPassword = state.users.userFormState.confirmPassword
  const role = state.users.userFormState.role
  if (!username) {
    enqueueSnackbar('Falta nombre de usuario', { variant: 'error' })
    return
  }
  if (!password) {
    enqueueSnackbar('Falta contraseña del usuario', { variant: 'error' })
    return
  }
  if (!confirmPassword) {
    enqueueSnackbar('Falta confirmar contraseña', { variant: 'error' })
    return
  }
  if (!role) {
    enqueueSnackbar('Falta rol o tipo de usuario', { variant: 'error' })
    return
  }
  const dbResponse = await effects.users.createUser({
    username,
    password,
    confirmPassword,
    role,
  })

  if (isErrorResponse(dbResponse)) {
    const message: string =
      ((await dbResponse.response.json()) as any).detail ??
      'Un Error desconocido ocurrió mientras se creaba el usuario'
    const duplicateMessage = message.includes('User_username_key')
      ? 'Usuario ya existe en la base de datos'
      : message
    enqueueSnackbar(duplicateMessage, { variant: 'error' })
    return
  }
  actions.users.setDialogOpen()
  enqueueSnackbar(`${dbResponse.username} creado con éxito`, {
    variant: 'success',
  })
  await actions.users.getUsers()
}

export async function deleteUser({ state, actions, effects }: Context) {
  const id = state.users.userFormState.id
  if (!id) {
    enqueueSnackbar('Debe seleccionar un usuario a eliminar', {
      variant: 'error',
    })
    return
  }
  const deleteUserDbResponse = await effects.users.deleteUser(id)
  if (isErrorResponse(deleteUserDbResponse)) {
    actions.application.setConfirmationModal()
    const detail = ((await deleteUserDbResponse.response.json()) as any).detail
    enqueueSnackbar(detail, { variant: 'error' })
    return
  }
  actions.application.setConfirmationModal()
  await actions.users.getUsers()
  enqueueSnackbar('Usuario eliminado con éxito', { variant: 'success' })
}

export async function getUserById({ state, effects }: Context) {
  state.users.viewUserOpen = true
  state.users.loadingUserData = true
  const dbResponse = await effects.users.getUserByUserId(
    state.users.userFormState.id ?? 'no-id-de-usuario',
  )
  if (isErrorResponse(dbResponse)) {
    state.users.loadingUserData = false
    state.users.viewUserOpen = false
    const detail = ((await dbResponse.response.json()) as any).detail
    enqueueSnackbar(detail, { variant: 'error' })
    return
  }
  state.users.loadingUserData = false
  state.users.userById = dbResponse
}

export function setUserViewModal({ state }: Context) {
  state.users.viewUserOpen = !state.users.viewUserOpen
}

export async function updateUserInfo({ state, effects, actions }: Context) {
  const info = {
    username: state.users.userFormState.username,
    role: state.users.userFormState.role,
    id: state.users.userFormState.id ?? '',
    password: state.users.userFormState.password,
  }

  const updatedUser = await effects.users.updateUser(info)

  if (isErrorResponse(updatedUser)) {
    const error = (await updatedUser.response.json()) as any
    return enqueueSnackbar(
      error.detail ?? error.message ?? 'No se actualizo el usuario',
      { variant: 'error' },
    )
  }
  await actions.users.getUsers()
  return enqueueSnackbar(
    `Usuario ${updatedUser.username} actualizado con éxito`,
    { variant: 'success' },
  )
}
