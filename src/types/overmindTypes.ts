import { Customer } from './models'

export type MenuSectionOptions =
  | 'invoice'
  | 'product'
  | 'customer'
  | ''
  | 'dashboard'
  | 'accounting'
  | 'users'
  | 'transaction'
  | 'pending'

export type Tenant = {
  id: string
  tenant_name: string
  payment_date: string
  profile_picture_url: string
  email: string
  billing_address: string
  subscription_status: string
}

export type Business = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  address: string | null
  rnc: number | null
  phone: string | null
  email: string | null
  logourl: string | null
  tenant_id: string
  invoice_observation: string
}

export type Application = {
  menuOpen: boolean
  language: string
  currentPage: string
  isLoading: boolean
  login: {
    username: string
    password: string
    tenant: string
  }
  sessionIO: 'authorized' | 'authorizing' | 'unauthorized'
  isNavigating: boolean
  confirmationOpen: boolean
  currentSection: MenuSectionOptions
  isAuthorized: boolean
  tenant: Tenant | null
  loadingTheme: boolean
  useNarrowedMenu: boolean
}

export type WeeklySales = {
  invoiceTotal: number
  amountSold: number
}
export type TodaySales = {
  dayOrderTotal: number
  soldToday: number
}

type MonthRevenue = Record<
  string,
  {
    name: string
    value: number
  }
>
type YearRevenue = MonthRevenue

type MostSoldProduct = {
  total_sold: string
  productId: string
}
type MonthSummary = {
  invoiceTotal: number
  amountSold: number
}

type YearSummary = {
  invoiceTotal: number
  amountSold: number
}

type WeeklySummary = Record<
  string,
  {
    lastMonthSales: number
    thisMonthSales: number
  }
>

type CustomerWithMostPurchases = {
  total_invoices: string
  customer_id: string
}

export type WeekOrderStatus = {
  weeklySummaries: WeeklySummary
  weeklySales: WeeklySales
  todaySales: TodaySales
  yearRevenue: YearRevenue
  mostSoldProduct: MostSoldProduct
  monthSummary: MonthSummary
  yearSummary: YearSummary
  customerWithMostPurchases: CustomerWithMostPurchases
}

export type DashboardState = {
  weekStatus: WeekOrderStatus
  loadingWeekStatus: boolean
}

export type ReportDateRange = {
  startDate?: string
  endDate?: string
  key?: string
  customerId?: string
  productId?: string
}

export type InvoiceTransaction = {
  amount: number
  createdAt: string
  description: string
  transaction_type: 'credit' | 'debit'
  username: string
  account_name: string
}

export type CustomerState = {
  loadingData: boolean
  viewOpen: boolean
  customerForm: Customer
  customers: Customer[]
  createModalState: boolean
  activationConfirmationModal: boolean
}

export type InvoiceTransactionForm = {
  amount: number
  user_id: string
  description: string
  invoice_id: string
  pendingBalance?: number
  destination: 'Bank' | 'Cashier'
}
export type FilteredTransactionForm = {
  fromDate: string
  toDate: string
  accountsIds: string[]
}

export type TransactionState = {
  submitState: 'idle' | 'submitting' | 'submitted'
  createTransactionModal: boolean
  loadingIOState: 'idle' | 'loading'
  invoiceTransactionForm: InvoiceTransactionForm
  form: {
    from: Date
    to: Date
  }
  transactions: {
    amount: number
    payment_method: 'Bank' | 'Cashier'
  }[]
}

export type InvoiceWithTransaction = {
  id: string
  user_id: string
  status: string
  customer_id: string
  createdAt: string
  total: number
  subtotal: number
  tax: number
  discount: number
  invoiceNo: number
  nullReason: string
  expiration_date: string
  name: string
  username: string
  pendingBalance: number
  transactions: InvoiceTransaction[]
}
export type ExpiredInvoice = {
  createdAt: string
  total: number
  invoiceNo: number
  expiration_date: string
  username: string
  customer_name: string
  phone: string
  address: string
  vendor: string | null
}

export type AccountTransaction = {
  createdAt: string
  creditAmount: number
  debitAmount: number
  transaction_type: string
  account_name: string
  account_id: string
  username: string
  category_name: string
}
export type Account = {
  accountName: string
  id: string
  total: number
  categories: Record<string, { amount: number; id: string }>
  visible: boolean
}
export type AccountSummary = Record<string, Account>
export type FullAccount = {
  accountName: string
  accountId: string
  categories: {
    id: string
    name: string
  }[]
}

export type BusinessState = {
  business: Business
  isLoading: boolean
  businessDataForm: {
    name: string
    address: string
    rnc: number | undefined
    phone: string
    email: string
    invoice_observation: string
  }
  imageRenderingKey: string
}

export interface Transaction {
  id: string
  amount: number
  username: string
  transaction_type: 'credit' | 'debit'
  description: string | null
  createdAt: string
  status: string
  account_name: string
}

export interface TransactionsRecord {
  [key: string]: Transaction[]
}
