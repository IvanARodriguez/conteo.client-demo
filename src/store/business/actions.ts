import { BusinessState } from '@/types'
import { Context } from '..'
import { isErrorResponse } from '@/api/util'
import { enqueueSnackbar } from 'notistack'

export function setFormData(
  { state }: Context,
  {
    value,
    dataType,
  }: {
    value: string | number
    dataType: keyof BusinessState['businessDataForm']
  },
) {
  switch (dataType) {
    case 'address':
    case 'name':
    case 'phone':
    case 'email':
    case 'invoice_observation':
      if (typeof value === 'string') {
        state.business.businessDataForm[dataType] = value
      }
      break
    case 'rnc':
      if (typeof value === 'number') {
        state.business.businessDataForm[dataType] = value
      }
      break
    default:
      throw new Error('Invalid dataType')
  }
}

export const getBusinessData = async ({ state, effects }: Context) => {
  const business = await effects.business.getBusinessDetail()

  if (isErrorResponse(business)) {
    const detail =
      ((await business.response.json()) as any).detail ?? 'Error desconocido'
    return enqueueSnackbar(detail, { variant: 'error' })
  }

  state.business.business = business
  state.business.businessDataForm.name = business.name
  state.business.businessDataForm.address = business.address ?? ''
  state.business.businessDataForm.rnc = business.rnc ?? 9999999999
  state.business.businessDataForm.phone = business.phone ?? ''
  state.business.businessDataForm.email = business.email ?? ''
  state.business.businessDataForm.invoice_observation =
    business.invoice_observation ?? ''
}

export async function updateBusiness({ state, effects }: Context) {
  if (state.business.isLoading) {
    return
  }
  state.business.isLoading = true
  if (!state.business.businessDataForm.name) {
    state.business.isLoading = false
    return enqueueSnackbar('Debe proveer nombre de la empresa', {
      variant: 'error',
    })
  }

  const dbResponse = await effects.business.updateBusinessData(
    state.business.businessDataForm,
  )

  if (isErrorResponse(dbResponse)) {
    state.business.isLoading = false
    const error = (await dbResponse.response.json()) as any
    enqueueSnackbar(
      error.detail ??
        error.message ??
        'No se pudo actualizar a información de empresa',
      { variant: 'error' },
    )
    return
  }
  state.business.isLoading = false
  state.business.business = dbResponse
}

export async function updateBusinessLogo(
  { effects, state }: Context,
  file: File,
) {
  if (state.business.isLoading) {
    return
  }
  state.business.isLoading = true
  const response = await effects.business.updateBusinessLogo({
    file,
    businessId: state.business.business.id,
  })
  if (isErrorResponse(response)) {
    state.business.isLoading = false
    const error = (await response.response.json()) as any
    enqueueSnackbar(
      error.detail ?? error.message ?? 'No se pudo actualizar logo',
      { variant: 'error' },
    )
    return
  }
  state.business.isLoading = false
  state.business.imageRenderingKey = Date.now().toString()
  enqueueSnackbar(response, { variant: 'success' })
}
