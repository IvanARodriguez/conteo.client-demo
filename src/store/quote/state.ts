import { derived } from 'overmind'
import { Invoice, InvoicePageState, QuotePageState } from '../../types'
import { Profile } from '../profile/state'
import getUTCDateString from '@/hooks/use-utc-date'

export const state: QuotePageState = {
  quotes: [],
  createViewOpen: false,
  loadingQuotes: false,
  viewModalOpen: false,
  formState: {
    customerId: '',
    userId: derived(
      (_: any, rootState: { profile: Profile }) => rootState.profile.id,
    ),
    total: derived(
      (_, rootState: { quote: InvoicePageState }) =>
        rootState.quote.formState.subtotal +
        rootState.quote.formState.tax -
        rootState.quote.formState.discount,
    ),
    subtotal: 0,
    discount: 0,
    tax: 0,
    expirationDate: getUTCDateString(),
    orders: [],
  },
  useTax: false,
  orderForm: {
    productId: '',
    quantity: 0,
    amount: derived((state, root: { quote: InvoicePageState }) => {
      const orderForm = root.quote.orderForm
      return orderForm.quantity * orderForm.productPrice
    }),
    productPrice: 0,
  },
  quoteTable: {
    quote_number: 0,
    customerId: '',
    customerName: '',
    date: new Date(),
    amount: 0,
  },
  quoteViewData: null,
  loadingFullQuote: false,
}
