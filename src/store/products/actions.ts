import { enqueueSnackbar } from 'notistack'
import { Context } from '..'
import { isErrorResponse } from '../../api/util'
import { Inventory } from '@mui/icons-material'
import { Product, ProductForm } from '@/types'

export function setFormField(
  { state }: Context,
  {
    value,
    fieldType,
  }: { value: boolean | number | string; fieldType: keyof ProductForm },
) {
  switch (fieldType) {
    case 'name':
    case 'details':
    case 'id':
      if (typeof value === 'string') {
        state.product.form[fieldType] = value
      }
      break
    case 'price':
      if (typeof value === 'number') {
        state.product.form[fieldType] = value
      }
      break
    case 'inventory_managed':
    case 'disabled':
      if (typeof value === 'boolean') {
        state.product.form[fieldType] = value
      }
  }
}

export async function createProduct({ state, effects, actions }: Context) {
  if (state.product.loadingProduct) {
    return
  }
  const formValues = state.product.form
  const response = await effects.product.addProduct({
    name: formValues.name,
    price: formValues.price,
    details: formValues.details ?? '',
    disabled: formValues.disabled,
    inventory_managed: formValues.inventory_managed,
  })
  if (isErrorResponse(response)) {
    const detail = ((await response.response.json()) as any).detail as string
    const evaluatedDetail = detail.includes('already exists')
      ? `El producto ${formValues.name} ya existe`
      : detail
    return enqueueSnackbar(evaluatedDetail, { variant: 'error' })
  }
  await actions.product.getProducts()
  actions.product.resetProductForm()
  actions.product.setCreateModalOpen(false)
  return enqueueSnackbar(`${formValues.name} creado con éxito`, {
    variant: 'success',
  })
}
export function setEditModalOpen({ state }: Context) {
  state.product.editModalOpen = !state.product.editModalOpen
}

export async function setCreateModalOpen({ state }: Context, isOpen: boolean) {
  state.product.modalIsOpen = isOpen
}

export async function getProducts({ effects, state, actions }: Context) {
  if (state.product.loadingProduct) {
    return
  }
  state.product.loadingProduct = true
  const products = await effects.product.getProducts()
  if (!products) {
    state.product.loadingProduct = false
    return
  }
  state.product.loadingProduct = false

  state.product.products = products
}

export async function deleteProduct({ state, effects, actions }: Context) {
  if (state.product.loadingProduct) {
    return
  }
  state.product.loadingProduct = true
  const { id } = state.product.form
  if (!id) {
    state.product.loadingProduct = false
    enqueueSnackbar('No se pudo obtener Id Del producto a eliminar', {
      variant: 'error',
    })
    return
  }
  const resultFromApi = await effects.product.deleteProduct(id)
  if (isErrorResponse(resultFromApi)) {
    state.product.loadingProduct = false
    actions.application.setConfirmationModal()
    const responseJson = (await resultFromApi.response.json()) as any
    return enqueueSnackbar(responseJson.detail, {
      variant: 'error',
    })
  }
  await actions.product.getProducts()
  state.product.loadingProduct = false
  actions.application.setConfirmationModal()
  enqueueSnackbar('El Producto a sido eliminado', { variant: 'success' })
}

export async function updateProduct({ state, effects, actions }: Context) {
  if (state.product.loadingProduct) {
    return
  }
  state.product.loadingProduct = true
  const formValues = state.product.form
  if (!formValues.id) {
    enqueueSnackbar('Product id is null or not defined', { variant: 'error' })
    return
  }
  if (!formValues.name) {
    enqueueSnackbar('Product name is null or not defined', { variant: 'error' })
    return
  }

  const { id, name, details, price, inventory_managed, disabled } = formValues
  return await effects.product
    .updateProduct({
      id,
      name,
      details,
      price,
      inventory_managed,
      disabled,
    })
    .then(_ => {
      state.product.loadingProduct = false
      actions.product.getProducts()
      actions.product.resetProductForm()
      enqueueSnackbar(`${name} ha sido actualizado`, { variant: 'success' })
    })
    .catch(err => {
      actions.product.resetProductForm()
      state.product.loadingProduct = false
      enqueueSnackbar(err, { variant: 'error' })
    })
}

export function setProductViewModal({ state }: Context) {
  state.product.viewProductModalOpen = !state.product.viewProductModalOpen
}

export function setSelectedProduct({ state }: Context, productId: string) {
  state.product.selectedProductId = productId
}

export function resetProductForm({ state }: Context) {
  state.product.form.details = ''
  state.product.form.price = 0
  state.product.form.name = ''
  state.product.form.id = undefined
  state.product.form.disabled = false
}
