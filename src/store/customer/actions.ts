import { enqueueSnackbar } from 'notistack'
import { Context } from '..'
import { isErrorResponse } from '../../api/util'
import { TaxReceiptType } from '@/types'

export type CustomerPropsOptions =
  | 'rnc'
  | 'address'
  | 'id'
  | 'name'
  | 'phone'
  | 'email'
  | 'tax'

export function setCustomerProp(
  { state }: Context,
  {
    option,
    value,
  }: {
    option: CustomerPropsOptions
    value: string | number | TaxReceiptType
  },
) {
  switch (option) {
    case 'id':
      state.customer.customerForm.id = value as string
      break
    case 'name':
      state.customer.customerForm.name = value as string
      break
    case 'address':
      state.customer.customerForm.address = value as string
      break
    case 'phone':
      state.customer.customerForm.phone = value as string
      break
    case 'rnc':
      state.customer.customerForm.rnc = value as number
      break
    case 'email':
      console.log(value)
      state.customer.customerForm.email = value as string
      break
    case 'tax':
      state.customer.customerForm.tax_type = value as TaxReceiptType
      break
    default:
      undefined
  }
}

export function setViewModal({ state }: Context) {
  state.customer.viewOpen = !state.customer.viewOpen
}

export function setCreateModal({ state }: Context) {
  state.customer.createModalState = !state.customer.createModalState
}

export async function getCustomers({ state, effects, actions }: Context) {
  if (state.business.isLoading) {
    return
  }
  state.customer.loadingData = true
  const response = await effects.customer.getCustomers()
  if (isErrorResponse(response)) {
    state.customer.loadingData = false
    enqueueSnackbar((response.response as any).detail, { variant: 'error' })
    return
  }
  state.customer.loadingData = false
  state.customer.customers = response
  return response
}
/**
 * @param payload customer id
 * @returns array of customers
 */
export async function getCustomerById(
  { effects, actions, state }: Context,
  id: string,
) {
  if (state.customer.loadingData) {
    return
  }
  state.customer.loadingData = true
  const response = await effects.customer.getCustomerById(id)
  if (isErrorResponse(response)) {
    state.customer.loadingData = false
    enqueueSnackbar((response.response as any).detail, { variant: 'error' })
    return
  }
  state.customer.loadingData = false
  return response
}
export async function deleteCustomer({ state, effects, actions }: Context) {
  if (state.customer.loadingData) {
    return
  }
  state.customer.loadingData = true
  const { id } = state.customer.customerForm
  if (!id) {
    enqueueSnackbar('Falta id de cliente para eliminar', { variant: 'error' })
    return
  }
  const response = await effects.customer.deleteCustomer(id)
  if (isErrorResponse(response)) {
    state.customer.loadingData = false
    actions.application.setConfirmationModal()
    const responseJson = (await response.response.json()) as any
    const message: string = responseJson.detail ?? responseJson.message ?? ''
    enqueueSnackbar(
      message.includes('still referenced')
        ? 'Cliente es referencia en otro elemento de la base de datos'
        : 'Un Error inesperado ocurrió mientras se intentaba eliminar el cliente.',
      { variant: 'error' },
    )
    return
  }
  enqueueSnackbar('Cliente eliminado con éxito', { variant: 'success' })
  actions.customer.getCustomers()
  actions.application.setConfirmationModal()
  state.customer.loadingData = false
  return response
}
export async function updateCustomer({ state, effects, actions }: Context) {
  if (state.customer.loadingData) {
    return
  }
  if (!state.customer.customerForm.id) {
    enqueueSnackbar('Falta Id para editar cliente', { variant: 'error' })
    return
  }
  if (!state.customer.customerForm.name) {
    enqueueSnackbar('Falta Nombre para editar cliente', { variant: 'error' })
    return
  }

  state.customer.loadingData = true
  const response = await effects.customer.updateCustomer(
    state.customer.customerForm.id,
    [
      { column: 'name', value: state.customer.customerForm.name },
      { column: 'rnc', value: state.customer.customerForm.rnc },
      { column: 'phone', value: state.customer.customerForm.phone ?? '' },
      { column: 'address', value: state.customer.customerForm.address },
      { column: 'tax_type', value: state.customer.customerForm.tax_type },
      { column: 'email', value: state.customer.customerForm.email },
    ],
  )
  if (isErrorResponse(response)) {
    state.customer.loadingData = false
    enqueueSnackbar((response.response as any).detail, { variant: 'error' })
    return
  }
  enqueueSnackbar('Cliente editado con éxito', { variant: 'success' })
  state.customer.loadingData = false
  await actions.customer.getCustomers()
  return response
}

export async function createCustomer({ state, actions, effects }: Context) {
  if (state.customer.loadingData) {
    return
  }
  const { name, address, rnc, phone, tax_type, email } =
    state.customer.customerForm

  if (!name) {
    enqueueSnackbar('Falta Nombre para editar cliente', { variant: 'error' })
    return
  }
  state.customer.loadingData = true
  const response = await effects.customer.createCustomer({
    name,
    address,
    rnc,
    phone,
    tax_type,
    email,
  })
  if (isErrorResponse(response)) {
    state.customer.loadingData = false
    const json = await response.response.json()
    const msg = json.detail ?? json.message ?? 'Error creando cliente'
    enqueueSnackbar(msg, {
      variant: 'error',
    })
    return
  }
  state.customer.customerForm.address = ''
  state.customer.customerForm.name = ''
  state.customer.customerForm.phone = ''
  state.customer.customerForm.address = ''
  state.customer.customerForm.email = ''
  state.customer.customerForm.tax_type = null
  state.customer.customerForm.rnc = 0
  actions.customer.setCreateModal()
  state.customer.loadingData = false
  state.customer.customers = response
  enqueueSnackbar('Cliente creado con éxito', { variant: 'success' })
  return
}

export async function changeActiveStatus(
  { effects, state, actions }: Context,
  activationData: { activeStatus: boolean },
) {
  if (state.customer.loadingData) {
    return
  }
  state.customer.loadingData = true
  alert(state.customer.customerForm.id)
  alert(activationData.activeStatus)
  const databaseResponse = await effects.customer.changeActiveStatus({
    activeStatus: activationData.activeStatus,
    customerId: state.customer.customerForm.id ?? '',
  })
  if (isErrorResponse(databaseResponse)) {
    state.customer.loadingData = false
    const errorMessage = (await databaseResponse.response.json()) as any
    actions.customer.setActivationModal()

    return enqueueSnackbar(errorMessage.detail ?? errorMessage.message, {
      variant: 'error',
    })
  }
  actions.customer.setActivationModal()
  actions.customer.getCustomers()
  enqueueSnackbar('Usuario modificado con éxito', { variant: 'success' })
}

export function setActivationModal({ state }: Context) {
  state.customer.activationConfirmationModal =
    !state.customer.activationConfirmationModal
}
