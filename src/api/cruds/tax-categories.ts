import { TaxCategories, TaxReceiptType } from '@/types'
import { createErrorResponse } from '../util'

export async function getTaxCategories() {
  const res = await fetch('/api/tax')
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as TaxCategories[]
}
export async function updateInitialTaxCategoryValue({
  value,
  type,
}: {
  value: number
  type: TaxReceiptType
}) {
  if (type === null) return
  const params = new URLSearchParams({
    value: value.toString(),
    type: type as string,
  })
  const res = await fetch(`/api/tax?${params}`, {
    method: 'PUT',
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }

  return (await res.json()) as TaxCategories
}
