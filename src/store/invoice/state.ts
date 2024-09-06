import { derived } from 'overmind'
import { CustomerState, InvoicePageState } from '../../types'
import { Profile } from '../profile/state'
import getUTCDateString from '@/hooks/use-utc-date'

export const state: InvoicePageState = {
  invoices: [],
  createViewOpen: false,
  retrieve: false,
  loadingInvoices: false,
  updateInvoices: false,
  viewModalOpen: false,
  formState: {
    customerId: '',
    vendorId: '',
    orders: [],
    userId: derived(
      (_: any, rootState: { profile: Profile }) => rootState.profile.id,
    ),
    total: derived(
      (_, rootState: { invoice: InvoicePageState }) =>
        rootState.invoice.formState.subtotal +
        rootState.invoice.formState.tax -
        rootState.invoice.formState.discount,
    ),
    subtotal: 0,
    discount: 0,
    tax: 0,
    status: 'Paid',
    expirationDate: getUTCDateString(),
    createdAt: getUTCDateString(),
    transactionLocation: undefined,
  },
  useTax: derived(
    (local: InvoicePageState, rootState: { customer: CustomerState }) => {
      const foundCustomer = rootState.customer.customers.filter(
        c => c.id === local.formState.customerId,
      )
      if (foundCustomer.length > 0 && foundCustomer[0].tax_type) return false
      return true
    },
  ),
  orderForm: {
    productId: '',
    quantity: 0,
    amount: derived((state, root: { invoice: InvoicePageState }) => {
      const orderForm = root.invoice.orderForm
      return orderForm.quantity * orderForm.productPrice
    }),
    productPrice: 0,
  },
  invoiceTable: {
    invoiceNo: 0,
    customerId: '',
    customerName: '',
    date: new Date(),
    amount: 0,
  },
  invoiceViewData: null,
  loadingFullInvoice: false,
  nullingForm: {
    reason: '',
    nullFormOpen: false,
    invoiceId: '',
    confirm: '',
  },
  pendingInvoices: [],
  refreshData: false,
  loadingPendingInvoices: false,
  invoiceAccountsViewOpen: false,
  expiredInvoices: [],
  loadingExpiredInvoice: true,
}
