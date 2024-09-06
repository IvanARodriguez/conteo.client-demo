import {
  Account,
  AccountSummary,
  AccountTransaction,
  FilteredTransactionForm,
  FullAccount,
  TransactionsRecord,
} from '@/types'
import dayjs from 'dayjs'
import { derived } from 'overmind'
import utc from 'dayjs/plugin/utc'

type AccountingState = {
  updateAccountForm: {
    visible: boolean
  }
  accounts: AccountSummary
  limitedAccounts: FullAccount[]
  summaryLoadingState: 'idle' | 'loading' | 'loaded'
  loadingFilteredTransactions: boolean
  formOpened: boolean
  transactionForm: {
    creditAccount: FullAccount
    creditAccountCategory: {
      id: string
      name: string
    }
    debitAccount: FullAccount
    IOState: 'idle' | 'submitting' | 'submitted'
    debitAccountCategory: {
      id: string
      name: string
    }

    amount: number
    confirmation: string
    isAdjustment: boolean
    description: string
    userId: string
  }
  createAccountForm: {
    open: boolean
    accountName: string
    confirmation: string
  }
  filterTransactionForm: FilteredTransactionForm
  accountsTransactions: AccountTransaction[]
  filteredTransactions: TransactionsRecord
  selectedAccount: Account
  accountCategoryForm: {
    submitState: 'loading' | 'submitted' | 'idle'
    categoryName: string
    accountId: string
    formDialogOpen: boolean
  }
}
dayjs.extend(utc)
export const state: AccountingState = {
  formOpened: false,
  accounts: {},
  summaryLoadingState: 'idle',
  createAccountForm: {
    open: false,
    accountName: '',
    confirmation: '',
  },
  transactionForm: {
    amount: 0,
    IOState: 'idle',
    confirmation: '',
    creditAccount: {
      accountName: '',
      accountId: '',
      categories: [],
    },
    debitAccount: {
      accountName: '',
      accountId: '',
      categories: [],
    },
    isAdjustment: false,
    description: '',
    userId: derived((_, rootState: any) => rootState.profile.id ?? ''),
    creditAccountCategory: { id: '', name: '' },
    debitAccountCategory: { id: '', name: '' },
  },
  filterTransactionForm: {
    fromDate: dayjs().startOf('day').utc().format(),
    toDate: dayjs().endOf('day').utc().format(),
    accountsIds: [],
  },
  loadingFilteredTransactions: false,
  accountsTransactions: [],
  filteredTransactions: {},
  selectedAccount: {
    accountName: '',
    id: '',
    total: 0,
    categories: {},
    visible: false,
  },
  accountCategoryForm: {
    accountId: '',
    submitState: 'idle',
    formDialogOpen: false,
    categoryName: '',
  },
  updateAccountForm: {
    visible: false,
  },
  limitedAccounts: [],
}
