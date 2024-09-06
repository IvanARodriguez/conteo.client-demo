import { Business } from '@/types'
import { createErrorResponse, isErrorResponse } from '../util'

export async function getBusinessDetail() {
  const response = await fetch('/api/business')
  if (isErrorResponse(response)) {
    return createErrorResponse(response)
  }
  const business = (await response.json()) as Business
  return business
}

export async function updateBusinessLogo({
  file,
  businessId,
}: {
  file: File
  businessId: string
}) {
  const formData = new FormData()

  formData.append('businessLogo', file)

  const response = await fetch(`/api/business/${businessId}/upload-image`, {
    method: 'POST',
    body: formData,
  })

  // Check if the request was successful
  if (!response.ok) {
    return createErrorResponse(response)
  }

  return 'Logo de empresa actualizado con éxito'
}

export async function updateBusinessData(businessData: {
  name: string
  address: string
  phone: string
  email: string
  rnc: number | undefined
  invoice_observation: string
}) {
  const dbResponse = await fetch('/api/business', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData),
  })

  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const updatedBusiness = (await dbResponse.json()) as Business
  return updatedBusiness
}
