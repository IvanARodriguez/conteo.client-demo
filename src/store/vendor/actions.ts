import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'

export async function getVendors({ state, effects }: Context) {
  const result = await effects.vendor.getVendors()
  state.vendor.loadingIOState = 'loading'

  if (isErrorResponse(result)) {
    const errorResponse = result.response.json() as any
    state.vendor.loadingIOState = 'loading'
    const message =
      errorResponse.detail ??
      errorResponse.message ??
      'No de pudo obtener los vendedores'
    return enqueueSnackbar(message, { variant: 'error' })
  }

  state.vendor.loadingIOState = 'loaded'
  state.vendor.vendors = result
}

export function setVendorFormField(
  { state }: Context,
  values: { type: 'active' | 'name' | 'id'; newValue: string | boolean },
) {
  if (values.type === 'active' && typeof values.newValue === 'boolean') {
    state.vendor.vendorForm.active = values.newValue
    return
  }
  if (values.type === 'name' && typeof values.newValue === 'string') {
    state.vendor.vendorForm.vendorName = values.newValue
    return
  }
  if (values.type === 'id' && typeof values.newValue === 'string') {
    state.vendor.vendorForm.id = values.newValue
    return
  }
}

export function changeFormActionType(
  { state }: Context,
  value: 'update' | 'create',
) {
  state.vendor.vendorForm.formType = value
}

export function toggleFormDialog({ state }: Context) {
  state.vendor.vendorForm.isOpen = !state.vendor.vendorForm.isOpen
}

export async function createVendor({ state, effects, actions }: Context) {
  if (!state.vendor.vendorForm.vendorName) {
    return enqueueSnackbar('Nombre e vendedor es requerido', {
      variant: 'error',
    })
  }
  state.vendor.loadingIOState === 'loading'
  const result = await effects.vendor.createVendor({
    vendorName: state.vendor.vendorForm.vendorName,
  })

  if (isErrorResponse(result)) {
    state.vendor.loadingIOState = 'idle'
    const error = (await result.response.json()) as any
    const message =
      error.detail ?? error.message ?? 'Error inesperado al crear el vendedor'
    return enqueueSnackbar(message, { variant: 'error' })
  }
  enqueueSnackbar(`Vendedor ${result.vendor_name} se ha creado con éxito`, {
    variant: 'success',
  })
  state.vendor.loadingIOState = 'idle'

  await actions.vendor.getVendors()
}

export async function updateVendor({ state, effects, actions }: Context) {
  const form = state.vendor.vendorForm
  if (!form.vendorName) {
    return enqueueSnackbar('Nombre e vendedor es requerido', {
      variant: 'error',
    })
  }
  const { id, vendorName, active } = form

  state.vendor.loadingIOState === 'loading'
  const result = await effects.vendor.updateVendor(
    {
      vendor_name: vendorName ?? undefined,
      active: active ?? undefined,
    },
    id,
  )

  if (isErrorResponse(result)) {
    state.vendor.loadingIOState = 'idle'
    const error = (await result.response.json()) as any
    const message =
      error.detail ?? error.message ?? 'Error inesperado al crear el vendedor'
    return enqueueSnackbar(message, { variant: 'error' })
  }
  enqueueSnackbar(`Vendedor ${result.vendor_name} se ha creado con éxito`, {
    variant: 'success',
  })
  state.vendor.loadingIOState = 'idle'

  await actions.vendor.getVendors()
}

export async function getActiveVendors({ state, effects }: Context) {
  const result = await effects.vendor.getActiveVendors()
  state.vendor.loadingIOState = 'loading'

  if (isErrorResponse(result)) {
    const errorResponse = result.response.json() as any
    state.vendor.loadingIOState = 'loading'
    const message =
      errorResponse.detail ??
      errorResponse.message ??
      'No de pudo obtener los vendedores activos'
    return enqueueSnackbar(message, { variant: 'error' })
  }

  state.vendor.loadingIOState = 'loaded'
  state.vendor.activeVendors = result
}

export async function deleteVendor({ state, effects, actions }: Context) {
  state.vendor.loadingIOState = 'loading'
  const { id } = state.vendor.vendorForm
  const result = await effects.vendor.deleteVendor(id)
  if (isErrorResponse(result)) {
    const error = (await result.response.json()) as any
    const message =
      error.detail ?? error.message ?? 'Error critico al eliminar vendedor'
    state.vendor.loadingIOState = 'idle'
    return enqueueSnackbar(message, { variant: 'error' })
  }

  state.vendor.loadingIOState = 'idle'
  actions.vendor.getVendors()
  enqueueSnackbar(result.message, { variant: 'success' })
}
