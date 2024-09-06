import {
  AccountTransaction,
  FilteredTransactionForm,
  InvoiceTransaction,
  InvoiceTransactionForm,
} from '@/types'
import { createErrorResponse } from '../util'

export async function createInvoiceTransaction(
  invoiceTransaction: InvoiceTransactionForm,
) {
  console.table(invoiceTransaction)
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoiceTransaction),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as InvoiceTransaction[]
}

export async function getAccountsTransactions(form: FilteredTransactionForm) {
  const res = await fetch('/api/transactions/filtered', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as AccountTransaction[]
}
