import {
  ExpiredInvoice,
  ExtendedInvoice,
  FullInvoice,
  Invoice,
  InvoiceFormState,
  InvoiceWithTransaction,
} from '../../types'
import { createErrorResponse } from '../util'

export async function createInvoice(invoiceValues: InvoiceFormState) {
  console.table(invoiceValues)
  const res = await fetch('/api/invoice', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoiceValues),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return (await res.json()) as FullInvoice
}
export async function getInvoiceById(id: string) {
  const res = await fetch(`/api/invoice/${id}`)
  if (!res) {
    return createErrorResponse(res)
  }
  const invoice = (await res.json()) as FullInvoice
  return invoice
}

export async function nullifyInvoice(id: string, nullReason: string) {
  const res = await fetch(`/api/invoice/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'Nulled', nullReason }),
  })

  if (!res.ok) {
    return createErrorResponse(res)
  }

  const invoice = (await res.json()) as Invoice
  return invoice
}

export async function getPendingInvoices() {
  const res = await fetch('/api/invoice/pending')
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return (await res.json()) as InvoiceWithTransaction[]
}
export async function getExpiredInvoices() {
  const res = await fetch('/api/invoice/expired')
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return (await res.json()) as ExpiredInvoice[]
}
