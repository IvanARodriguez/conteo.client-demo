import { Business, BusinessState } from '@/types'
import { randomUUID } from 'crypto'
import { derived } from 'overmind'

export const state: BusinessState = {
  business: {
    address: '',
    createdAt: '',
    email: '',
    id: '',
    logourl: '',
    name: '',
    phone: '',
    rnc: 0,
    tenant_id: '',
    updatedAt: '',
    invoice_observation: '',
  },
  imageRenderingKey: Date.now().toString(),
  isLoading: false,
  businessDataForm: {
    name: '',
    address: '',
    email: '',
    phone: '',
    rnc: 0,
    invoice_observation: '',
  },
}
