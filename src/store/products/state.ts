import { Product, ProductForm } from '../../types'

export type ProductState = {
  form: ProductForm
  modalIsOpen: boolean
  editModalOpen: boolean
  products: Product[]
  validationErrors: { [productId: string]: string }
  loadingProduct: boolean
  viewProductModalOpen: boolean
  selectedProductId: string
}

export const state: ProductState = {
  form: {
    id: '',
    name: '',
    price: 0,
    details: '',
    disabled: false,
    inventory_managed: false,
  },
  loadingProduct: false,
  modalIsOpen: false,
  editModalOpen: false,
  products: [],
  validationErrors: {},
  viewProductModalOpen: false,
  selectedProductId: '',
}
