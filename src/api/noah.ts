import { RegistrationState } from '@/store/registration/state'
import { UserData } from '../types'
import { createErrorResponse, isErrorResponse } from './util'
import { ActivationRequestBody } from '@/store/registration/actions'

export async function getUser() {
  console.log('GettingUser')
  const res = await fetch('/api/user')

  if (!res.ok || res.status === 500) {
    return createErrorResponse(res)
  }
  return (await res.json()) as UserData
}

export async function logout() {
  const res = await fetch('/api/user/logout')
  if (!res.ok) return createErrorResponse(res)
  return res
}

export async function login({
  username,
  password,
  tenant,
}: {
  username: string
  password: string
  tenant: string
}) {
  const res = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      tenantName: tenant,
    }),
  })

  if (!res.ok || res.status === 500) {
    return createErrorResponse(res)
  }
  const user = (await res.json()) as UserData
  return user
}

export async function activateAccount(request: ActivationRequestBody) {
  const requestBody = request
  const res = await fetch('/api/tenant/activate', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    return createErrorResponse(res)
  }
  return res.ok
}

export async function createTenant(fields: {
  tenantName: string
  email: string
  billingAddress: string
}) {
  const res = await fetch('/api/tenant', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  })

  if (!res.ok) {
    return createErrorResponse(res)
  }
  const json = (await res.json()) as { message: string }
  return json.message
}

export * from './cruds/product'
export * from './cruds/customer'
export * from './cruds/invoices'
export * from './cruds/dashboard'
export * from './cruds/user'
export * from './cruds/quote'
export * from './cruds/report'
export * from './cruds/transaction'
export * from './cruds/accounting'
export * from './cruds/business'
export * from './cruds/vendor'
export * from './cruds/tax-categories'
