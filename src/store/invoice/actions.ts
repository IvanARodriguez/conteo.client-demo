import { enqueueSnackbar } from 'notistack'
import clone from 'clone'
import { Context } from '..'
import { isErrorResponse } from '../../api/util'
import { InvoiceFormState, InvoiceStatus } from '../../types'
import dayjs, { Dayjs } from 'dayjs'

export const setCreateModal = ({ state, actions }: Context) => {
  state.invoice.createViewOpen = !state.invoice.createViewOpen
  actions.invoice.resetCreateFormState()
}

export const reloadInvoices = ({ state }: Context) =>
  (state.invoice.retrieve = !state.invoice.retrieve)

export function setInvoiceFormStatus(
  { state }: Context,
  status: InvoiceStatus,
) {
  state.invoice.formState.status = status
}

export function setInvoiceAmount({ state }: Context, newAmount: number) {
  state.invoice.formState.subtotal = newAmount
}

export function setInvoiceExpirationDate({ state }: Context, expDate: string) {
  if (expDate) state.invoice.formState.expirationDate = expDate
}

export function setOrderTotalField({ state }: Context) {
  const { quantity, productPrice } = state.invoice.orderForm

  if (quantity === 0) {
    state.invoice.orderForm.amount = productPrice
    return
  }
  state.invoice.orderForm.amount = productPrice * quantity
}

export function setOrderQuantityField(
  { state, actions }: Context,
  quantity: number,
) {
  state.invoice.orderForm.quantity = quantity
  actions.invoice.setOrderTotalField()
}

export function setOrderProductField({ state }: Context, id: string) {
  state.invoice.orderForm.productId = id
}

export function setInvoiceOrder({ state, actions }: Context) {
  const { productId, amount, quantity, productPrice } = state.invoice.orderForm
  const currentOrders = clone([
    ...state.invoice.formState.orders,
    { productId, amount, quantity, productPrice },
  ])

  state.invoice.formState.orders = currentOrders
  let newTotal = 0
  state.invoice.formState.orders.forEach(order => {
    newTotal += order.amount
  })
  actions.invoice.setOrderQuantityField(0)
  actions.invoice.setOrderProductField('')
  actions.invoice.setInvoiceAmount(newTotal)
  actions.invoice.calculateTax()
}

export function removeInvoiceOrder({ state, actions }: Context, index: number) {
  const currentOrders = clone([...state.invoice.formState.orders]).filter(
    (_, id) => id !== index,
  )
  state.invoice.formState.orders = currentOrders
}

export function setInvoiceCustomerId(
  { state, actions }: Context,
  customerId: string,
) {
  state.invoice.formState.customerId = customerId
  actions.invoice.calculateTax()
}

export function setInvoiceVendorId({ state }: Context, vendorId: string) {
  state.invoice.formState.vendorId = vendorId
}

export function setInvoiceCreatedAt({ state }: Context, createdAt: string) {
  state.invoice.formState.createdAt = createdAt
}

export function setPaymentDestiny(
  { state }: Context,
  destiny: 'Bank' | 'Cashier',
) {
  state.invoice.formState.transactionLocation = destiny
}

export async function createInvoice({ state, effects, actions }: Context) {
  if (state.invoice.loadingInvoices) {
    return
  }
  const invoiceFormState = state.invoice.formState

  const isFormStateValid = actions.invoice.createValuesIsValid()

  if (!isFormStateValid) {
    return
  }

  const invoiceFormValues: InvoiceFormState = {
    userId: invoiceFormState.userId,
    customerId: invoiceFormState.customerId,
    total: invoiceFormState.total,
    expirationDate: invoiceFormState.expirationDate,
    tax: invoiceFormState.tax,
    discount: invoiceFormState.discount,
    subtotal: invoiceFormState.subtotal,
    status: invoiceFormState.status,
    orders: invoiceFormState.orders,
    createdAt: invoiceFormState.createdAt,
    vendorId: invoiceFormState.vendorId,
  }

  actions.invoice.resetCreateFormState()

  const result = await effects.invoice.createInvoice({
    ...invoiceFormValues,
    transactionLocation: invoiceFormState.transactionLocation,
  })

  if (isErrorResponse(result)) {
    enqueueSnackbar(((await result.response.json()) as any).detail, {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Factura creada con éxito', { variant: 'success' })
  actions.invoice.toggleRefresh()

  await actions.invoice.getFullInvoice(result.id)
  actions.invoice.setCreateModal()
  actions.dashboard.getWeekOrderStatus()
  actions.invoice.setViewModal()
}

export const createValuesIsValid = ({ state }: Context): boolean => {
  const invoiceFormState = state.invoice.formState
  if (invoiceFormState.orders.length === 0) {
    enqueueSnackbar('Factura debe de incluir ordenes', { variant: 'error' })
    return false
  }
  if (!invoiceFormState.customerId) {
    enqueueSnackbar('Un Cliente debe ser seleccionado', { variant: 'error' })
    return false
  }
  if (!invoiceFormState.userId) {
    enqueueSnackbar('No se pudo obtener id del usuario', { variant: 'error' })
    return false
  }
  if (!invoiceFormState.total || invoiceFormState.total === 0) {
    enqueueSnackbar('Total de factura debe ser mayor que 0', {
      variant: 'error',
    })
    return false
  }
  return true
}

export function setViewModal({ state }: Context) {
  state.invoice.viewModalOpen = !state.invoice.viewModalOpen
}

export async function getFullInvoice(
  { state, effects, actions }: Context,
  id: string,
) {
  if (state.invoice.loadingFullInvoice) {
    return
  }
  state.invoice.loadingFullInvoice = true
  const res = await effects.invoice.getInvoiceById(id)
  if (isErrorResponse(res)) {
    const message = (await res.response.json()) as any
    state.invoice.loadingFullInvoice = false
    actions.invoice.setViewModal()
    enqueueSnackbar(message.detail, { variant: 'error' })
    return
  }
  state.invoice.loadingFullInvoice = false
  state.invoice.invoiceViewData = res
}

export function handleOrderChangeDecrement(
  { state, actions }: Context,
  { orderIndex, price }: { orderIndex: number; price: number },
) {
  // Directly modify the state for reactivity
  const order = state.invoice.formState.orders[orderIndex]

  if (order.quantity > 0) {
    order.quantity -= 1
    order.amount = price * order.quantity
  }

  // If quantity is zero, you might want to remove the order from the array
  if (order.quantity === 0) {
    state.invoice.formState.orders.splice(orderIndex, 1)
  }

  actions.invoice.calculateTax()
}
export function handleOrderChangeIncrement(
  { state, actions }: Context,
  { orderIndex, price }: { orderIndex: number; price: number },
) {
  // Directly modify the state for reactivity
  const order = state.invoice.formState.orders[orderIndex]

  if (order.quantity > 0) {
    order.quantity += 1
    order.amount = price * order.quantity
  }

  // If quantity is zero, you might want to remove the order from the array
  if (order.quantity === 0) {
    state.invoice.formState.orders.splice(orderIndex, 1)
  }

  actions.invoice.calculateTax()
}

export const calculateTax = ({ state }: Context) => {
  state.invoice.formState.subtotal = state.invoice.formState.orders
    .map(o => o.amount)
    .reduce((prev, next) => prev + next, 0)

  // Consigue el cliente seleccionado
  const selectedCustomer = state.customer.customers.filter(
    c => c.id === state.invoice.formState.customerId,
  )

  if (selectedCustomer.length !== 0 && selectedCustomer[0].tax_type) {
    state.invoice.formState.tax = state.invoice.formState.subtotal * 0.18
    return
  }

  state.invoice.formState.tax = 0
}

export function setOrderProductPrice(
  { state, actions }: Context,
  price: number,
) {
  state.invoice.orderForm.productPrice = price
  actions.invoice.setOrderTotalField()
}

export function setNullReason({ state }: Context, reason: string) {
  state.invoice.nullingForm.reason = reason
}
export function setInvoiceId({ state }: Context, id: string) {
  state.invoice.nullingForm.invoiceId = id
}
export function setNullModal({ state }: Context, isOpen: boolean) {
  state.invoice.nullingForm.nullFormOpen = isOpen
}

export function setConfirm({ state }: Context, value: string) {
  state.invoice.nullingForm.confirm = value
}
export function updateInvoices({ state }: Context) {
  state.invoice.updateInvoices = !state.invoice.updateInvoices
}

export async function deleteInvoice({ state, actions, effects }: Context) {
  const id = state.invoice.nullingForm.invoiceId
  const nullReason = state.invoice.nullingForm.reason
  if (!nullReason || !id) {
    enqueueSnackbar('Se necesita id y razón para anular una factura', {
      variant: 'error',
    })
    return
  }
  state.invoice.loadingInvoices = true
  const databaseResponse = await effects.invoice.nullifyInvoice(id, nullReason)
  if (isErrorResponse(databaseResponse)) {
    state.invoice.loadingInvoices = false
    const message = (await databaseResponse.response.json()) as any
    enqueueSnackbar(message.detail, { variant: 'error' })
    return
  }
  enqueueSnackbar('La factura se ha anulado con éxito', { variant: 'success' })
  state.invoice.nullingForm.confirm = ''
  state.invoice.nullingForm.reason = ''
  state.invoice.loadingInvoices = false
  actions.invoice.updateInvoices()
}

export function resetCreateFormState({ state, actions }: Context) {
  state.invoice.formState.customerId = ''
  state.invoice.formState.subtotal = 0
  state.invoice.formState.orders = []
  state.invoice.formState.discount = 0
  state.invoice.useTax = false
  state.invoice.formState.tax = 0
  state.invoice.formState.expirationDate = dayjs(Date.now()).toISOString()
  state.invoice.formState.createdAt = dayjs(Date.now()).toISOString()
  state.invoice.formState.status = 'Paid'
  state.invoice.formState.vendorId = ''
}

export async function getPendingInvoice({ state, effects }: Context) {
  state.invoice.loadingPendingInvoices = true
  const dbResponse = await effects.invoice.getPendingInvoices()
  if (isErrorResponse(dbResponse)) {
    state.invoice.loadingPendingInvoices = false
    const detail = ((await dbResponse.response.json()) as any).detail
    return enqueueSnackbar(detail, { variant: 'error' })
  }
  state.invoice.loadingPendingInvoices = false
  state.invoice.pendingInvoices = dbResponse
}

export const toggleRefresh = ({ state }: Context) => {
  state.invoice.refreshData = !state.invoice.refreshData
}
export const toggleOpenAccountViewModal = ({ state }: Context) => {
  state.invoice.invoiceAccountsViewOpen = !state.invoice.invoiceAccountsViewOpen
}

export const getExpiredInvoices = async ({ state, effects }: Context) => {
  state.invoice.loadingExpiredInvoice = true
  const result = await effects.invoice.getExpiredInvoices()
  if (isErrorResponse(result)) {
    state.invoice.loadingExpiredInvoice = false
    const error = (await result.response.json()) as any
    const message = error.detail ?? 'Error al obtener facturas expiradas'
    return enqueueSnackbar(message, { variant: 'error' })
  }
  state.invoice.loadingExpiredInvoice = false
  state.invoice.expiredInvoices = result
}
