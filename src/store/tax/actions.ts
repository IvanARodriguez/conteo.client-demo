import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'
import clone from 'clone'
import { TaxReceiptType } from '@/types'

export async function getTaxCategories({ effects, state }: Context) {
  state.tax.isLoading = true

  const dbResult = await effects.tax.getTaxCategories()

  if (isErrorResponse(dbResult)) {
    const msg = await dbResult.response.json()
    state.tax.isLoading = false
    enqueueSnackbar(
      msg.detail ??
        msg.message ??
        'No se pudieron obtener las categorias de comprobantes',
      { variant: 'error' },
    )
    return
  }
  dbResult.forEach(r => {
    if (r.type === 'B01') state.tax.updateFormB01 = r.starting_number
    if (r.type === 'B02') state.tax.updateFormB02 = r.starting_number
    if (r.type === 'B04') state.tax.updateFormB04 = r.starting_number
    if (r.type === 'B14') state.tax.updateFormB14 = r.starting_number
    if (r.type === 'B15') state.tax.updateFormB15 = r.starting_number
    if (r.type === 'B16') state.tax.updateFormB16 = r.starting_number
  })
  state.tax.taxCategories = dbResult
  state.tax.isLoading = false
}

export function updateFormValue(
  { state }: Context,
  { value, type }: { value: number; type: TaxReceiptType },
) {
  if (type === null) {
    return
  }
  if (type === 'B01') state.tax.updateFormB01 = value
  if (type === 'B02') state.tax.updateFormB02 = value
  if (type === 'B04') state.tax.updateFormB04 = value
  if (type === 'B14') state.tax.updateFormB14 = value
  if (type === 'B15') state.tax.updateFormB15 = value
  if (type === 'B16') state.tax.updateFormB16 = value
}

export async function updateTaxCategory(
  { effects, state, actions }: Context,
  type: TaxReceiptType,
) {
  let value = 0
  if (type === 'B01') value = state.tax.updateFormB01
  if (type === 'B02') value = state.tax.updateFormB02
  if (type === 'B04') value = state.tax.updateFormB04
  if (type === 'B14') value = state.tax.updateFormB14
  if (type === 'B15') value = state.tax.updateFormB15
  if (type === 'B16') value = state.tax.updateFormB16

  const dbResult = await effects.tax.updateInitialTaxCategoryValue({
    type,
    value,
  })
  if (isErrorResponse(dbResult)) {
    const msg = await dbResult.response.json()
    state.tax.isLoading = false
    enqueueSnackbar(
      msg.detail ??
        msg.message ??
        'No se pudieron obtener las categorías de comprobantes',
      { variant: 'error' },
    )
    return
  }

  enqueueSnackbar(`Typo de comprobante ${type} actualizado`, {
    variant: 'success',
  })
  const cloneState = clone(state.tax.taxCategories)
  cloneState.forEach(cat => {
    if (dbResult && cat.type === dbResult.type) {
      cat.starting_number = dbResult.starting_number
      cat.current_number_used = dbResult.current_number_used
    }
  })
  state.tax.taxCategories = cloneState
}
