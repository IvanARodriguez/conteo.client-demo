import { Customer, TaxReceiptType } from '../../types'
import { createErrorResponse } from '../util'

export async function getCustomers() {
  const res = await fetch('/api/customer')
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as Customer[]
}
export async function getCustomerById(id: string) {
  const res = await fetch(`/api/customer/${id}`)
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as Customer[]
}
export async function createCustomer(customer: Customer) {
  const res = await fetch('/api/customer', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }

  const customers: Customer[] = await res.json()

  return customers
}
export async function changeActiveStatus(data: {
  customerId: string
  activeStatus: boolean
}) {
  const res = await fetch(`/api/customer/activation/${data.customerId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ activeStatus: data.activeStatus }),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as Customer[]
}

type ValidCostumerColumns =
  | 'name'
  | 'address'
  | 'rnc'
  | 'phone'
  | 'tax_type'
  | 'email'

type UpdateCustomerArgs = {
  column: ValidCostumerColumns
  value: string | number | boolean | TaxReceiptType
}

export async function updateCustomer(id: string, args: UpdateCustomerArgs[]) {
  const res = await fetch(`/api/customer/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return (await res.json()) as Customer
}

export async function deleteCustomer(id: string) {
  const res = await fetch(`/api/customer/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  return true
}
