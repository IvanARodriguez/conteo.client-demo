import { TaxCategories, TaxReceiptType } from '@/types'

type TaxState = {
  taxCategories: TaxCategories[]
  isLoading: boolean
  updateFormB01: number
  updateFormB02: number
  updateFormB04: number
  updateFormB14: number
  updateFormB15: number
  updateFormB16: number
}

export const state: TaxState = {
  taxCategories: [],
  isLoading: false,
  updateFormB01: 0,
  updateFormB02: 0,
  updateFormB04: 0,
  updateFormB14: 0,
  updateFormB15: 0,
  updateFormB16: 0,
}
