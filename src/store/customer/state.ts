import { Customer, CustomerState } from '../../types'

export const state: CustomerState = {
  loadingData: false,
  createModalState: false,
  viewOpen: false,
  activationConfirmationModal: false,
  customerForm: {
    id: '',
    address: '',
    name: '',
    phone: '',
    rnc: 0,
    tax_type: null,
    email: '',
  },
  customers: [],
}
