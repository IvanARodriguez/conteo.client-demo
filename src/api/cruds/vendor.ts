import { Vendor } from '@/types'
import { API_ROOT } from '../constants'
import { createErrorResponse } from '../util'

// Get all vendors
export async function getVendors() {
  const dbResponse = await fetch(`${API_ROOT}/vendor`)
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const vendors = (await dbResponse.json()) as Vendor[]
  return vendors
}

// Get vendor by ID
// Get all vendors
export async function getVendorById(id: string) {
  const dbResponse = await fetch(`${API_ROOT}/vendor/${id}`)
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const vendors = (await dbResponse.json()) as Vendor
  return vendors
}

export async function createVendor(vendor: { vendorName: string }) {
  const dbResponse = await fetch(`${API_ROOT}/vendor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vendor),
  })
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const vendors = (await dbResponse.json()) as Vendor
  return vendors
}

// Update Vendor
interface VendorFields {
  vendor_name?: string
  active?: boolean
}

export async function updateVendor(vendor: VendorFields, id: string) {
  const dbResponse = await fetch(`${API_ROOT}/vendor/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vendor),
  })
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const vendors = (await dbResponse.json()) as Vendor
  return vendors
}

export async function getActiveVendors() {
  const dbResponse = await fetch(`${API_ROOT}/vendor?active=true`)
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const vendors = (await dbResponse.json()) as Vendor[]
  return vendors
}

export async function deleteVendor(id: string) {
  const response = await fetch(`${API_ROOT}/vendor/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    return createErrorResponse(response)
  }

  const message = (await response.json()) as { message: string }

  return message
}
