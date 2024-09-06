import { enqueueSnackbar } from 'notistack'
import { Context } from '..'
import { isErrorResponse } from '../../api/util'
import { MenuSectionOptions } from '../../types'

export const setLanguage = ({ state }: Context, lang: string) => {
  state.application.language = lang
}

export const setMenuOpen = ({ state }: Context) => {
  state.application.menuOpen = !state.application.menuOpen
}
export const setCurrentPage = ({ state }: Context, page: string) => {
  state.application.currentPage = page
}

export const setUsername = ({ state }: Context, newValue: string) => {
  state.application.login.username = newValue
}
export const setTenant = ({ state }: Context, newValue: string) => {
  state.application.login.tenant = newValue
}
export const setPassword = ({ state }: Context, newValue: string) => {
  state.application.login.password = newValue
}

export const resetLoginData = ({ state }: Context) => {
  state.application.login.username = ''
  state.application.login.password = ''
}

export const logout = async ({ state, effects, actions }: Context) => {
  if (
    state.application.isLoading ||
    state.application.sessionIO === 'authorizing'
  ) {
    return
  }
  state.application.isLoading = true
  const res = await effects.application.logout()
  if (isErrorResponse(res)) {
    state.application.isLoading = false
    const detail = ((await res.response.json()) as any).detail
    enqueueSnackbar(detail, { variant: 'error' })
    state.application.sessionIO = 'authorized'
    return
  }
  // Set application initial state
  state.customer.customers = []
  state.product.products = []
  state.invoice.invoices = []
  state.report.reports = []
  state.accounting.accounts = {}
  state.dashboard.weekStatus = {
    yearSummary: { amountSold: 0, invoiceTotal: 0 },
    customerWithMostPurchases: { customer_id: '', total_invoices: '' },
    monthSummary: { amountSold: 0, invoiceTotal: 0 },
    mostSoldProduct: { productId: '', total_sold: '' },
    todaySales: { dayOrderTotal: 0, soldToday: 0 },
    weeklySales: { amountSold: 0, invoiceTotal: 0 },
    weeklySummaries: {},
    yearRevenue: {},
  }
  state.quote.quotes = []
  state.quote.quoteViewData = null

  state.profile.role = ''
  state.profile.username = ''
  state.application.isLoading = false
  actions.application.setNavigating(false)
  state.application.sessionIO = 'unauthorized'
}

export const login = async ({ effects, state, actions }: Context) => {
  if (state.application.sessionIO === 'authorizing') {
    return
  }
  state.application.sessionIO = 'authorizing'
  state.application.isLoading = true

  const res = await effects.application.login({
    username: state.application.login.username,
    password: state.application.login.password,
    tenant: state.application.login.tenant,
  })

  if (isErrorResponse(res)) {
    state.application.isLoading = false
    state.application.sessionIO = 'unauthorized'
    const responseJson = ((await res.response.json()) as any).detail
    enqueueSnackbar(responseJson ?? 'No se pudo conectar al backend', {
      variant: 'error',
    })
    return
  }

  actions.application.setNavigating(true)
  state.application.login.username = ''
  state.application.login.password = ''
  state.profile.username = res.username
  state.profile.role = res.role
  state.profile.id = res.id
  state.application.sessionIO = 'authorized'
  state.application.isLoading = false
}

export const setNavigating = ({ state }: Context, isNavigating: boolean) => {
  state.application.isNavigating = isNavigating
}

export const setConfirmationModal = ({ state }: Context) => {
  state.application.confirmationOpen = !state.application.confirmationOpen
}

export const setMenuSection = (
  { state }: Context,
  section: MenuSectionOptions,
) => {
  state.application.currentSection = section
}

export const setInitialState = ({ state, actions }: Context) => {
  actions.accounting.resetAccountInfo()
}

export function setUseNarrowedMenu({ state }: Context) {
  state.application.useNarrowedMenu = !state.application.useNarrowedMenu
}
