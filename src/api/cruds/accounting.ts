import {
  Account,
  AccountSummary,
  FullAccount,
  Transaction,
  TransactionsRecord,
} from '@/types'
import { createErrorResponse, isErrorResponse } from '../util'

export async function getAccountSummary() {
  const summary = await fetch('/api/accounting/summary')
  if (isErrorResponse(summary)) {
    return createErrorResponse(summary)
  }
  const result = (await summary.json()) as AccountSummary
  return result
}
type AccountingTransaction = {
  creditAccountId: string
  creditCategoryId: string
  debitAccountId: string
  debitCategoryId: string
  amount: number
  isAdjustment: boolean
  userId: string
  description: string
}
export async function createAccountTransaction(trans: AccountingTransaction) {
  const dbResult = await fetch('/api/accounting/transaction', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trans),
  })
  if (!dbResult.ok) {
    return createErrorResponse(dbResult)
  }
  const response = (await dbResult.json()) as { message: string }
  return response
}

export async function createAccount(name: string) {
  const dbResult = await fetch('/api/accounting', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
  if (!dbResult.ok) {
    return createErrorResponse(dbResult)
  }

  return (await dbResult.json()) as { message: string }
}

export async function getFilteredTransactions(queryParams: {
  fromDate: string
  toDate: string
}) {
  const dbResponse = await fetch('/api/accounting/filtered/transactions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryParams),
  })

  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  return (await dbResponse.json()) as TransactionsRecord
}

export async function createAccountCategory(queryParams: {
  accountId: string
  categoryName: string
}) {
  const serverResult = await fetch('/api/accounting/category', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryParams),
  })

  if (!serverResult.ok) {
    return createErrorResponse(serverResult)
  }
  const json = (await serverResult.json()) as { message: string }
  return json
}

export async function updateAccount({
  id,
  visible,
}: {
  id: string
  visible: boolean
}) {
  const dbResponse = await fetch(`/api/accounting/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ visible }),
  })
  if (isErrorResponse(dbResponse)) {
    return createErrorResponse(dbResponse)
  }

  return { message: 'Cuenta actualizada con éxito' }
}

export async function getAllAccounts() {
  const dbResponse = await fetch('/api/accounting')
  if (isErrorResponse(dbResponse)) {
    return createErrorResponse(dbResponse)
  }
  const result = (await dbResponse.json()) as FullAccount[]
  return result
}
