import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'
import { Account, FullAccount } from '@/types'
import clone from 'clone'

export function resetAccountInfo({ state }: Context) {
  state.accounting.summaryLoadingState = 'idle'
  state.accounting.accounts = {}
  state.accounting.transactionForm.amount = 0
  state.accounting.transactionForm.confirmation = ''
  const emptyAccountValues = {
    accountName: '',
    accountId: '',
    categories: [],
  }
  state.accounting.transactionForm.creditAccount = emptyAccountValues
  state.accounting.transactionForm.debitAccount = emptyAccountValues
  state.accounting.transactionForm.isAdjustment = false
  state.accounting.transactionForm.description = ''
  state.accounting.transactionForm.userId = ''
  state.accounting.formOpened = false
}

export async function getAccountSummary({ state, effects }: Context) {
  const loadingState = state.accounting.summaryLoadingState
  if (loadingState === 'loading') {
    return
  }
  state.accounting.summaryLoadingState = 'loading'
  const accountsResult = await effects.accounting.getAccountSummary()
  if (isErrorResponse(accountsResult)) {
    const error = accountsResult.response.json() as any
    state.accounting.summaryLoadingState = 'idle'
    return enqueueSnackbar(error.detail, { variant: 'error' })
  }
  state.accounting.summaryLoadingState = 'loaded'
  state.accounting.accounts = accountsResult
  if (
    Object.values(accountsResult).length > 0 &&
    !state.accounting.selectedAccount.id
  ) {
    state.accounting.selectedAccount = clone(Object.values(accountsResult)[0])
  }
}

export function setAccountCategory(
  { state }: Context,
  {
    category,
    variant,
  }: {
    category: { id: string; name: string } | null
    variant: 'debit' | 'credit'
  },
) {
  if (!category) return
  if (variant === 'debit') {
    state.accounting.transactionForm.debitAccountCategory = clone(category)
    return
  }
  state.accounting.transactionForm.creditAccountCategory = clone(category)
}

type TransFormItem =
  | 'amount'
  | 'confirmation'
  | 'creditAccount'
  | 'debitAccount'
  | 'isAdjustment'
  | 'description'
  | 'isCreditAdjustment'

export async function setTransactionFormItem(
  { state }: Context,
  {
    formItem,
    value,
  }: {
    formItem: TransFormItem
    value: string | number | boolean | FullAccount
  },
) {
  const { transactionForm } = state.accounting

  switch (formItem) {
    case 'amount':
      if (typeof value === 'number') transactionForm.amount = value
      break
    case 'confirmation':
      if (typeof value === 'string') transactionForm.confirmation = value
      break
    case 'creditAccount':
      if (typeof value === 'object') {
        transactionForm.creditAccount = clone(value)
      }
      break
    case 'debitAccount':
      if (typeof value === 'object') {
        transactionForm.debitAccount = clone(value)
      }
      break
    case 'isAdjustment':
      if (typeof value === 'boolean') {
        transactionForm.isAdjustment = value
        if (value) {
          transactionForm.creditAccount.accountId = ''
          transactionForm.creditAccount.accountName = ''
          transactionForm.creditAccount.categories = []
          transactionForm.creditAccountCategory.id = ''
          transactionForm.creditAccountCategory.name = ''
        }
      }
      break
    case 'description':
      if (typeof value === 'string') transactionForm.description = value
      break
    default:
      break
  }
}

export async function createAccountTransaction({
  state,
  effects,
  actions,
}: Context) {
  if (state.accounting.transactionForm.IOState === 'submitting') {
    return
  }
  state.accounting.transactionForm.IOState = 'submitting'
  const formContent = state.accounting.transactionForm

  if(!formContent.creditAccount.accountId && !formContent.debitAccount.accountId ){
    state.accounting.transactionForm.IOState = 'idle'
    return enqueueSnackbar('Debe de eligir al menos una cuenta y una categoría', {variant: 'error'})
  }

  const requestBody = {
    amount: formContent.amount,
    creditAccountId: formContent.creditAccount.accountId,
    creditCategoryId: formContent.creditAccountCategory.id,
    debitAccountId: formContent.debitAccount.accountId,
    debitCategoryId: formContent.debitAccountCategory.id,
    userId: formContent.userId,
    description: formContent.description,
    isAdjustment: formContent.isAdjustment,
    creditAccountName: formContent.creditAccount.accountName,
    debitAccountName: formContent.debitAccount.accountName
  }

  const result = await effects.accounting.createAccountTransaction(requestBody)

  if (isErrorResponse(result)) {
    const error = (await result.response.json()) as any
    state.accounting.transactionForm.IOState = 'idle'
    state.accounting.summaryLoadingState = 'idle'
    return enqueueSnackbar(error.detail ?? error.message, { variant: 'error' })
  }
  state.accounting.transactionForm.IOState = 'submitted'
  enqueueSnackbar(result.message, { variant: 'success' })
  await actions.accounting.getAccountSummary()
  actions.accounting.resetAccountInfo()
}

export function setTransactionsFormOpen({ state }: Context) {
  state.accounting.formOpened = !state.accounting.formOpened
}
export function resetTransactionCreationFields({ state }: Context) {
  // Credit account Reset
  state.accounting.transactionForm.creditAccount.accountId = ''
  state.accounting.transactionForm.creditAccount.accountName = ''
  state.accounting.transactionForm.creditAccount.categories = []
  state.accounting.transactionForm.creditAccountCategory.id = ''
  state.accounting.transactionForm.creditAccountCategory.name = ''
  // Debit Account Reset
  state.accounting.transactionForm.debitAccount.accountId = ''
  state.accounting.transactionForm.debitAccount.accountName = ''
  state.accounting.transactionForm.debitAccount.categories = []
  state.accounting.transactionForm.debitAccountCategory.id = ''
  state.accounting.transactionForm.debitAccountCategory.name = ''
  // Transaction data reset
  state.accounting.transactionForm.amount = 0
  state.accounting.transactionForm.description = ''
  state.accounting.transactionForm.isAdjustment = false
  state.accounting.transactionForm.confirmation = ''
}
export function setCreateAccountFormOpen({ state }: Context) {
  state.accounting.createAccountForm.open =
    !state.accounting.createAccountForm.open
}
export function setAccountName({ state }: Context, name: string) {
  state.accounting.createAccountForm.accountName = name
}
export function setCreateAccountConfirmation(
  { state }: Context,
  confirmationWord: string,
) {
  state.accounting.createAccountForm.confirmation = confirmationWord
}
export async function createAccount({ state, effects, actions }: Context) {
  if (!state.accounting.createAccountForm.accountName) {
    return enqueueSnackbar('Debe proveer el nombre para la cuenta', {
      variant: 'error',
    })
  }
  const name = state.accounting.createAccountForm.accountName
  const dbResponse = await effects.accounting.createAccount(name)
  state.accounting.createAccountForm.confirmation = ''
  state.accounting.createAccountForm.accountName = ''
  if (isErrorResponse(dbResponse)) {
    state.accounting.createAccountForm.open = false
    return enqueueSnackbar(((await dbResponse.response.json()) as any).detail, {
      variant: 'error',
    })
  }

  state.accounting.createAccountForm.open = false
  actions.accounting.getAccountSummary()
  enqueueSnackbar(dbResponse.message, { variant: 'success' })
}

export async function getAccountsTransactions({ state, effects }: Context) {
  state.accounting.loadingFilteredTransactions = true
  const results = await effects.accounting.getAccountsTransactions(
    state.accounting.filterTransactionForm,
  )
  if (isErrorResponse(results)) {
    state.accounting.loadingFilteredTransactions = false
    state.accounting.createAccountForm.open = false
    return enqueueSnackbar(((await results.response.json()) as any).detail, {
      variant: 'error',
    })
  }
  state.accounting.loadingFilteredTransactions = false
  state.accounting.accountsTransactions = results
}

export function setFromDate({ state }: Context, fromDate: string) {
  state.accounting.filterTransactionForm.fromDate = fromDate
}

export function setToDate({ state }: Context, toDate: string) {
  state.accounting.filterTransactionForm.toDate = toDate
}

export function setFilterFormAccounts(
  { state }: Context,
  accountsIds: string[],
) {
  state.accounting.filterTransactionForm.accountsIds = accountsIds
}

export async function getFilteredTransactions({ state, effects }: Context) {
  state.accounting.loadingFilteredTransactions = true
  const fromDate = state.accounting.filterTransactionForm.fromDate
  const toDate = state.accounting.filterTransactionForm.toDate
  const dbResponse = await effects.accounting.getFilteredTransactions({
    fromDate,
    toDate,
  })
  if (isErrorResponse(dbResponse)) {
    state.accounting.loadingFilteredTransactions = false
    const error = (await dbResponse.response.json()) as any
    return enqueueSnackbar(
      error.detail ?? error.message ?? 'Error al buscar transacciones',
    )
  }
  state.accounting.loadingFilteredTransactions = false
  state.accounting.filteredTransactions = dbResponse
}

export function setSelectedAccount({ state }: Context, selection: Account) {
  state.accounting.selectedAccount = clone(selection)
  state.accounting.updateAccountForm.visible = selection.visible
}
export function setCategoryFormAccountId({ state }: Context, id: string) {
  state.accounting.accountCategoryForm.accountId = id
}
export function setCategoryFormName({ state }: Context, name: string) {
  state.accounting.accountCategoryForm.categoryName = name
}
export function setCategoryFormDialogOpen({ state }: Context) {
  state.accounting.accountCategoryForm.formDialogOpen =
    !state.accounting.accountCategoryForm.formDialogOpen
}

export async function createCategory({ state, effects, actions }: Context) {
  const { accountId, categoryName, submitState } =
    state.accounting.accountCategoryForm
  if (submitState === 'loading') {
    state.accounting.accountCategoryForm.formDialogOpen = false
    return
  }
  if (!accountId || !categoryName) {
    return enqueueSnackbar(
      'Debe seleccionar una cuenta y proveer un nombre de categoría',
      { variant: 'error' },
    )
  }

  state.accounting.accountCategoryForm.submitState = 'loading'

  const serverResponse = await effects.accounting.createAccountCategory({
    accountId,
    categoryName,
  })

  if (isErrorResponse(serverResponse)) {
    state.accounting.accountCategoryForm.submitState = 'idle'
    const error = (await serverResponse.response.json()) as any
    const message =
      error.detail ??
      error.message ??
      'Se ha producido un error creando la categoría'
    enqueueSnackbar(message, { variant: 'error' })
    return
  }
  state.accounting.accountCategoryForm.formDialogOpen = false
  await actions.accounting.getAccountSummary()
  state.accounting.accountCategoryForm.submitState = 'submitted'

  enqueueSnackbar(serverResponse.message, { variant: 'success' })
}

export async function setAccountFormVisibility(
  { state, effects, actions }: Context,
  newValue: boolean,
) {
  state.accounting.selectedAccount.visible = newValue
  const visible = state.accounting.selectedAccount.visible
  const id = state.accounting.selectedAccount.id
  const dbResponse = await effects.accounting.updateAccount({ id, visible })
  if (isErrorResponse(dbResponse)) {
    const error = (await dbResponse.response.json()) as any
    enqueueSnackbar(
      error.detail ?? error.message ?? 'La cuenta no fue actualizada',
      { variant: 'error' },
    )
    return
  }

  enqueueSnackbar(dbResponse.message, { variant: 'success' })
  await actions.accounting.getAccountSummary()
}
export async function getFullAccounts({ state, effects }: Context) {
  const loadingState = state.accounting.summaryLoadingState
  if (loadingState === 'loading') {
    return
  }
  state.accounting.summaryLoadingState = 'loading'
  const accountsResult = await effects.accounting.getAllAccounts()
  if (isErrorResponse(accountsResult)) {
    const error = accountsResult.response.json() as any
    state.accounting.summaryLoadingState = 'idle'
    return enqueueSnackbar(error.detail, { variant: 'error' })
  }
  state.accounting.summaryLoadingState = 'loaded'
  state.accounting.limitedAccounts = accountsResult
}
