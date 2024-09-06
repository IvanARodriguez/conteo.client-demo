import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'

export const setIsLoading = ({ state }: Context, isLoading: boolean) => {
  state.registration.activationForm.isLoading = isLoading
}

export const setUsername = ({ state }: Context, username: string) =>
  (state.registration.activationForm.admin.username = username)

export const setPassword = ({ state }: Context, password: string) =>
  (state.registration.activationForm.admin.password = password)

export const setConfirmPassword = ({ state }: Context, password: string) =>
  (state.registration.activationForm.admin.confirmPassword = password)

export const setBusinessName = ({ state }: Context, name: string) =>
  (state.registration.activationForm.business.name = name)

export const setBusinessAddress = ({ state }: Context, address: string) =>
  (state.registration.activationForm.business.address = address)

export const setBusinessPhone = ({ state }: Context, phone: string) =>
  (state.registration.activationForm.business.phone = phone)

export const setBusinessRNC = ({ state }: Context, rnc: number) =>
  (state.registration.activationForm.business.rnc = rnc)

export const setBusinessEmail = ({ state }: Context, email: string) =>
  (state.registration.activationForm.business.email = email)

export const setTaxB01 = ({ state }: Context, b01: number) =>
  (state.registration.activationForm.tax.B01 = b01)

export const setTaxB02 = ({ state }: Context, b02: number) =>
  (state.registration.activationForm.tax.B02 = b02)

export const setTaxB04 = ({ state }: Context, b04: number) =>
  (state.registration.activationForm.tax.B04 = b04)

export const setTaxB14 = ({ state }: Context, b14: number) =>
  (state.registration.activationForm.tax.B14 = b14)

export const setTaxB15 = ({ state }: Context, b15: number) =>
  (state.registration.activationForm.tax.B15 = b15)

export const setTaxB16 = ({ state }: Context, b16: number) =>
  (state.registration.activationForm.tax.B16 = b16)

export type ActivationRequestBody = {
  token: string
  admin: {
    username: string
    password: string
  }

  business: {
    name: string
    address: string
    rnc: number
    phone: string
    email: string
  }

  tax: {
    B01: number
    B02: number
    B04: number
    B14: number
    B15: number
    B16: number
  }
}

export async function activateAccount(
  { state, effects, actions }: Context,
  token: string,
) {
  const { admin, business, tax } = state.registration.activationForm
  const reqBody: ActivationRequestBody = {
    token,
    admin: {
      username: admin.username,
      password: admin.password,
    },
    business,
    tax,
  }
  const result = await effects.registration.activateAccount(reqBody)

  if (isErrorResponse(result)) {
    const json = await result.response.json()
    actions.registration.setIsActivated(false)
    const message =
      json.detail ??
      'Algo salio mal y no se activo la cuenta, contacte un administrador'
    enqueueSnackbar(message, { variant: 'error' })
    return
  }
  actions.registration.setIsActivated(true)
  enqueueSnackbar('Cuenta creada con éxito', {})
}

export async function createTenant(
  { effects }: Context,
  fields: { tenantName: string; email: string; billingAddress: string },
) {
  if (!fields.billingAddress || !fields.email || !fields.tenantName) {
    enqueueSnackbar('Debe proveer proveedor, email y dirección')
    return { success: false }
  }
  const res = await effects.registration.createTenant(fields)

  if (isErrorResponse(res)) {
    const json = await res.response.json()
    const { detail } = json
    enqueueSnackbar(
      detail ?? 'No se pudo crear el proveedor, inténtalo nuevamente',
      { variant: 'error' },
    )
    return { success: false }
  }

  enqueueSnackbar('Cuenta creada')
  return { success: true }
}

export const setIsActivated = ({ state }: Context, value: boolean) => {
  state.registration.isActivated = value
}
