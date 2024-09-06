import { enqueueSnackbar } from 'notistack'
import clone from 'clone'
import { Context } from '..'
import { isErrorResponse } from '../../api/util'
import { QuoteFormState, InvoiceStatus } from '../../types'

export const setCreateModal = ({ state }: Context) => {
  state.quote.createViewOpen = !state.quote.createViewOpen
}

export function setQuoteAmount({ state }: Context, newAmount: number) {
  state.quote.formState.subtotal = newAmount
}

export function setQuoteExpirationDate({ state }: Context, expDate: string) {
  if (expDate) state.quote.formState.expirationDate = expDate
}

export function setOrderTotalField({ state }: Context) {
  const { quantity, productPrice } = state.quote.orderForm

  if (quantity === 0) {
    state.quote.orderForm.amount = productPrice
    return
  }
  state.quote.orderForm.amount = productPrice * quantity
}

export function setOrderQuantityField(
  { state, actions }: Context,
  quantity: number,
) {
  state.quote.orderForm.quantity = quantity
  actions.quote.setOrderTotalField()
}

export function setOrderProductField({ state }: Context, id: string) {
  state.quote.orderForm.productId = id
}

export function setQuoteOrder({ state, actions }: Context) {
  const { productId, amount, quantity, productPrice } = state.quote.orderForm
  const currentOrders = clone([
    ...state.quote.formState.orders,
    { productId, amount, quantity, productPrice },
  ])

  state.quote.formState.orders = currentOrders
  let newTotal = 0
  state.quote.formState.orders.forEach(order => {
    newTotal += order.amount
  })
  actions.quote.setOrderQuantityField(0)
  actions.quote.setOrderProductField('')
  actions.quote.setQuoteAmount(newTotal)
  actions.quote.calculateTax()
}

export function removeQuoteOrder({ state, actions }: Context, index: number) {
  const currentOrders = clone([...state.quote.formState.orders]).filter(
    (_, id) => id !== index,
  )
  state.quote.formState.orders = currentOrders
  let newTotal = 0

  state.quote.formState.orders.forEach(order => {
    newTotal += order.amount
  })
  if (state.quote.useTax) {
    state.quote.formState.tax = newTotal * 0.18
  }
  actions.quote.setQuoteAmount(newTotal)
}

export async function getAllQuotes({ state, effects, actions }: Context) {
  if (state.quote.loadingQuotes) {
    return
  }
  state.quote.loadingQuotes = true
  const response = await effects.quote.getQuotes()
  if (isErrorResponse(response)) {
    enqueueSnackbar((response.response as any).detail, { variant: 'error' })
    state.quote.loadingQuotes = false
    return
  }
  state.quote.loadingQuotes = false
  state.quote.quotes = response || []
}

export function setQuoteCustomerId({ state }: Context, customerId: string) {
  state.quote.formState.customerId = customerId
}
export function setUseTax({ state, actions }: Context, useTaxValue: boolean) {
  state.quote.useTax = useTaxValue
  actions.quote.calculateTax()
}
export async function createQuote({ state, effects, actions }: Context) {
  if (state.quote.loadingQuotes) {
    return
  }
  state.quote.loadingQuotes = true
  const QuoteFormState = state.quote.formState
  const isFormStateValid = actions.quote.createValuesIsValid()
  if (!isFormStateValid) {
    state.quote.loadingQuotes = false
    return
  }

  const QuoteFormValues: QuoteFormState = {
    userId: QuoteFormState.userId,
    customerId: QuoteFormState.customerId,
    total: QuoteFormState.total,
    expirationDate: QuoteFormState.expirationDate,
    tax: QuoteFormState.tax,
    discount: QuoteFormState.discount,
    subtotal: QuoteFormState.subtotal,
    orders: QuoteFormState.orders,
  }

  const response = await effects.quote.createQuote(QuoteFormValues)
  if (isErrorResponse(response)) {
    enqueueSnackbar(((await response.response.json()) as any).detail, {
      variant: 'error',
    })
    return
  }

  actions.quote.getAllQuotes()
  enqueueSnackbar('Factura creada con éxito', { variant: 'success' })
  state.quote.quoteViewData = response
  state.quote.formState.customerId = ''
  state.quote.formState.subtotal = 0
  state.quote.formState.orders = []
  state.quote.formState.discount = 0
  state.quote.formState.tax = 0
  actions.quote.setCreateModal()
  actions.dashboard.getWeekOrderStatus()
  state.quote.loadingFullQuote = true
  actions.quote.setViewModal()
  state.quote.loadingFullQuote = false
}

export const createValuesIsValid = ({ state }: Context): boolean => {
  const QuoteFormState = state.quote.formState
  if (QuoteFormState.orders.length === 0) {
    enqueueSnackbar('Factura debe de incluir ordenes', { variant: 'error' })
    return false
  }
  if (!QuoteFormState.customerId) {
    enqueueSnackbar('Un Cliente debe ser seleccionado', { variant: 'error' })
    return false
  }
  if (!QuoteFormState.userId) {
    enqueueSnackbar('No se pudo obtener id del usuario', { variant: 'error' })
    return false
  }
  if (!QuoteFormState.total || QuoteFormState.total === 0) {
    enqueueSnackbar('Total de factura debe ser mayor que 0', {
      variant: 'error',
    })
    return false
  }
  return true
}

export function setViewModal({ state }: Context) {
  state.quote.viewModalOpen = !state.quote.viewModalOpen
}

export async function getFullQuote(
  { state, effects, actions }: Context,
  id: string,
) {
  if (state.quote.loadingFullQuote) {
    return
  }
  state.quote.loadingFullQuote = true
  const res = await effects.quote.getQuoteById(id)
  if (isErrorResponse(res)) {
    const message = (await res.response.json()) as any
    state.quote.loadingFullQuote = false
    actions.quote.setViewModal()
    enqueueSnackbar(message.detail, { variant: 'error' })
    return
  }
  state.quote.loadingFullQuote = false
  state.quote.quoteViewData = res
}

export function handleOrderChangeDecrement(
  { state, actions }: Context,
  orderIndex: number,
) {
  const order = clone(state.quote.formState.orders)

  order[orderIndex].quantity = order[orderIndex].quantity - 1

  const { price } = clone(state.product.products).filter(
    p => p.id === order[orderIndex].productId,
  )[0]
  order[orderIndex].amount = price * order[orderIndex].quantity

  if (order[orderIndex].quantity === 0) {
    state.quote.orderForm.amount = price
    return
  }

  state.quote.orderForm.amount = price * order[orderIndex].quantity
  state.quote.formState.orders = order
  let newTotal = 0
  order.forEach(order => {
    newTotal += order.amount
  })
  if (state.quote.useTax) {
    state.quote.formState.tax = newTotal * 0.18
  }
  actions.quote.setQuoteAmount(newTotal)
}
export function handleOrderChangeIncrement(
  { state, actions }: Context,
  orderIndex: number,
) {
  const order = clone(state.quote.formState.orders)

  order[orderIndex].quantity = order[orderIndex].quantity + 1

  const { price } = clone(state.product.products).filter(
    p => p.id === order[orderIndex].productId,
  )[0]

  order[orderIndex].amount = price * order[orderIndex].quantity
  if (order[orderIndex].quantity === 0) {
    state.quote.orderForm.amount = price
    return
  }

  state.quote.formState.orders = order
  state.quote.orderForm.amount = price * order[orderIndex].quantity
  let newTotal = 0
  order.forEach(order => {
    newTotal += order.amount
  })
  if (state.quote.useTax) {
    state.quote.formState.tax = newTotal * 0.18
  }
  actions.quote.setQuoteAmount(newTotal)
}

export const calculateTax = ({ state }: Context) => {
  if (state.quote.useTax) {
    state.quote.formState.tax = state.quote.formState.subtotal * 0.18
    return
  }
  state.quote.formState.tax = 0
}

export function setOrderProductPrice(
  { state, actions }: Context,
  price: number,
) {
  state.quote.orderForm.productPrice = price
  actions.quote.setOrderTotalField()
}

export async function deleteQuoteWithId(
  { state, effects, actions }: Context,
  id: string,
) {
  state.quote.loadingQuotes = true
  const dbResponse = await effects.quote.deleteQuote(id)
  if (isErrorResponse(dbResponse)) {
    const error = ((await dbResponse.response.json()) as any).detail
    enqueueSnackbar(error, { variant: 'error' })
    state.quote.loadingQuotes = false
    return
  }
  await actions.quote.getAllQuotes()
  state.quote.loadingQuotes = false
}
