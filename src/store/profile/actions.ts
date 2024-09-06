import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'

export const getUser = async ({ effects, state, actions }: Context) => {
  state.profile.updatingUserData = true
  const userResponse = await effects.profile.getUser()
  if (isErrorResponse(userResponse)) {
    state.application.sessionIO = 'unauthorized'
    state.profile.updatingUserData = false
    return null
  }

  state.profile.username = userResponse.username
  state.profile.role = userResponse.role
  state.profile.id = userResponse.id
  state.profile.setting = userResponse.setting

  state.application.sessionIO = 'authorized'
  state.profile.updatingUserData = false
}

type FieldValues = {
  field: 'username' | 'password' | 'role'
  value: string
}
export const setUpdateFormValue = (
  { state }: Context,
  { field, value }: FieldValues,
) => {
  if (field === 'username') state.profile.updateForm.username = value
  if (field === 'password') state.profile.updateForm.password = value
  if (field === 'role')
    state.profile.updateForm.role = value as 'ADMIN' | 'EMPLOYEE'
}
export async function setTheme({ state, actions }: Context) {
  if (state.profile.setting.theme === 'dark') {
    state.profile.setting.theme = 'light'
    state.profile.updateForm.theme = 'light'
    await actions.profile.updateProfile(null)
    return
  }
  state.profile.setting.theme = 'dark'
  state.profile.updateForm.theme = 'dark'
  await actions.profile.updateProfile(null)
}
export async function updateProfile(
  { state, effects, actions }: Context,
  file: Blob | null,
) {
  if (state.profile.updatingUserData) {
    return
  }
  state.profile.updatingUserData = true
  // This call must go first if we want the image to have the updated name
  const result = await effects.profile.updateProfile({
    userId: state.profile.id,
    settings: state.profile.updateForm,
  })

  if (isErrorResponse(result)) {
    state.profile.updatingUserData = false
    const backendError = result.response.json() as any

    return enqueueSnackbar(
      backendError.detail ??
        backendError.message ??
        'No se pudo actualizar el usuario',
      { variant: 'error' },
    )
  }

  if (file) {
    const imageResult = await effects.profile.updateImage({
      file,
      userId: state.profile.id,
    })

    if (isErrorResponse(imageResult)) {
      state.profile.updatingUserData = false
      const backendError = imageResult.response.json() as any
      enqueueSnackbar(
        backendError.detail ??
          backendError.message ??
          'No se pudo actualizar el usuario',
        { variant: 'error' },
      )
      return
    }
    state.profile.imageRenderingKey = Date.now().toString()
  }
  state.profile.updatingUserData = false
  await actions.profile.getUser()
}
