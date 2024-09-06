import { Application, TransactionState } from '@/types'
import { derived } from 'overmind'
import { Context } from '..'
import { Profile } from '../profile/state'

export const state: TransactionState = {
  createTransactionModal: false,
  submitState: 'idle',
  loadingIOState: 'idle',
  invoiceTransactionForm: {
    amount: 0,
    pendingBalance: 0,
    description: '',
    destination: 'Cashier',
    user_id: derived(
      (_, rootState: { profile: Profile; application: Application }) =>
        rootState.profile.id ?? '',
    ),
    invoice_id: '',
  },
  form: {
    from: new Date(),
    to: new Date(),
  },
  transactions: [],
}
