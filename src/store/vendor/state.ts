import { Vendor } from '@/types'

type VendorState = {
  vendors: Vendor[]
  activeVendors: Vendor[]
  loadingIOState: 'idle' | 'loading' | 'loaded'
  vendorForm: {
    formType: 'update' | 'create'
    isOpen: boolean
    vendorName: string
    active: boolean
    id: string
  }
}

export const state: VendorState = {
  vendors: [],
  activeVendors: [],
  loadingIOState: 'idle',
  vendorForm: {
    formType: 'create',
    vendorName: '',
    id: '',
    active: true,
    isOpen: false,
  },
}
