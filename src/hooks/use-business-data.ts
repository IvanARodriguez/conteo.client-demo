import { store } from '@/utils'
import { useState } from 'react'

// Function to format RNC number
function formatRNC(rnc: number | null) {
  if (!rnc) {
    return '000-00000-0'
  }
  // Convert the number to a string
  let numStr = rnc.toString()

  // Pad the string with leading zeros to ensure it has at least 8 characters
  numStr = numStr.padStart(8, '0')

  // Split the string into groups of 3, 5, and 1 characters
  const formattedNumber =
    numStr.slice(0, 3) + '-' + numStr.slice(3, 8) + '-' + numStr.slice(8)

  return formattedNumber
}

// Function to format phone number
function formatPhoneNumber(phone: string) {
  // Convert the number to a string
  const numStr = phone.replaceAll('-', '').padStart(10, '0')

  // Split the string into groups of 3, 3, and 4 characters
  const formattedNumber =
    numStr.slice(0, 3) + '-' + numStr.slice(3, 6) + '-' + numStr.slice(6)

  return formattedNumber
}

// Custom hook to manage business data state and formatting
function useBusinessData() {
  const state = store.useState()
  const businessData = state.business.business

  // Function to format business data
  const formattedBusinessData = {
    ...businessData,
    rnc: formatRNC(businessData.rnc),
    phone: formatPhoneNumber(businessData.phone ?? '0000000000'),
    updatedAt: new Date(businessData.updatedAt).toLocaleString(),
    createdAt: new Date(businessData.createdAt).toLocaleString(),
  }

  return {
    businessData,
    formattedBusinessData,
  }
}

export default useBusinessData
