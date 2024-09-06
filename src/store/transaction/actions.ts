import { InvoiceTransaction, InvoiceTransactionForm } from '@/types'
import { Context } from '..'
import { isErrorResponse } from '@/api/util'
import { enqueueSnackbar } from 'notistack'

export function setInvoiceFormDescription(
  { state }: Context,
  description: string,
) {
  state.transaction.invoiceTransactionForm.description = description
}

export function setInvoiceFormAmount({ state }: Context, amount: number) {
  state.transaction.invoiceTransactionForm.amount = amount
}

export function setInvoiceFormInvoiceId(
  { state }: Context,
  invoice_id: string,
) {
  state.transaction.invoiceTransactionForm.invoice_id = invoice_id
}

export function setInvoiceFormDestination(
  { state }: Context,
  method: 'Bank' | 'Cashier',
) {
  state.transaction.invoiceTransactionForm.destination = method
}

export function setInvoiceTransactionModal({ state }: Context, value: boolean) {
  state.transaction.createTransactionModal = value
}

export function setInvoicePendingBalance(
  { state }: Context,
  pendingBalance: number,
) {
  state.transaction.invoiceTransactionForm.pendingBalance = pendingBalance
}

export async function makeInvoicePayment({ state, effects, actions }: Context) {
  if (state.transaction.submitState === 'submitting') {
    return
  }
  state.transaction.submitState = 'submitting'
  const formValues = state.transaction.invoiceTransactionForm
  const dbRequestObject: InvoiceTransactionForm = {
    amount: formValues.amount,
    description: formValues.description ?? 'No hay descripción',
    invoice_id: formValues.invoice_id,
    destination: formValues.destination,
    user_id: formValues.user_id,
  }
  const dbResponse =
    await effects.transaction.createInvoiceTransaction(dbRequestObject)

  if (isErrorResponse(dbResponse)) {
    state.transaction.submitState = 'idle'
    const dbError = ((await dbResponse.response.json()) as any).detail
    return enqueueSnackbar(dbError, { variant: 'error' })
  }
  state.transaction.submitState = 'submitted'
  enqueueSnackbar(`Pago de ${formValues.amount} agregado con éxito`, {
    variant: 'success',
  })
  actions.transaction.setInvoiceTransactionModal(false)
  actions.transaction.setInvoiceFormAmount(0)
  actions.transaction.setInvoiceFormDescription('')
  actions.transaction.setInvoiceFormDestination('Cashier')
  actions.transaction.setInvoicePendingBalance(0)
  actions.transaction.setInvoiceFormInvoiceId('')
}

export function setFormDate(
  { state }: Context,
  { variant, value }: { variant: 'from' | 'to'; value: Date },
) {
  if (variant === 'from') {
    state.transaction.form.from = value
  }
  if (variant === 'to') {
    state.transaction.form.to = value
  }
}
