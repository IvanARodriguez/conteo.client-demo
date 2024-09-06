import { FullQuote, Quote, QuoteFormState } from '@/types'
import { createErrorResponse } from '../util'

export async function getQuotes() {
  const res = await fetch('/api/quote')
  if (!res) {
    return createErrorResponse(res)
  }
  const user = (await res.json()) as Quote[]
  return user
}

export async function createQuote(quoteValues: QuoteFormState) {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteValues),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return (await res.json()) as FullQuote
}

export async function getQuoteById(id: string) {
  const res = await fetch(`/api/quote/${id}`)
  if (!res) {
    return createErrorResponse(res)
  }
  const invoice = (await res.json()) as FullQuote
  return invoice
}
export async function deleteQuote(id: string) {
  const res = await fetch(`/api/quote/${id}`, {
    method: 'DELETE',
  })
  if (!res) {
    return createErrorResponse(res)
  }
  return []
}
