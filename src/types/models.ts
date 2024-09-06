import { Dayjs } from 'dayjs'
import {
  ExpiredInvoice,
  InvoiceTransaction,
  InvoiceWithTransaction,
} from './overmindTypes'

export type UsersModel = {
  username: string
  password: string
}

export type UserData = {
  id: string
  username: string
  role: string
  createdAt?: string
  password?: string
  setting: {
    theme: 'dark' | 'light'
    image: string
  }
}

export type UserByIdResult = {
  username: string
  role: string
  createdAt: string
  setting: {
    image: string
    theme: string
  }
  updatedAt: string
}
export type SessionData = {
  id: string
  session_token: string
  updated_at: string
}

export type ProductForm = {
  id?: string
  name: string
  price: number
  details: string
  disabled: boolean
  inventory_managed: boolean
}
export type Product = {
  id: string
  createdAt: string
  details: string
  disabled: boolean
  inventory_managed: boolean
  inventory_quantity: string
  name: string
  price: number
  updatedAt: string
}

export type TaxReceiptType =
  | 'B01'
  | 'B02'
  | 'B04'
  | 'B14'
  | 'B15'
  | 'B16'
  | null

export type Customer = {
  id?: string
  name: string
  address: string
  rnc: number
  phone?: string
  email: string
  tax_type: TaxReceiptType
}

export type InvoiceOrder = {
  id: string
  amount: number
  productId: string
  quantity: string
  productprice: number
}

export type FullInvoice = {
  id: string
  user_id: string
  customer_id: string
  vendor_id: string
  tax: number
  subtotal: number
  discount: number
  status: string
  createdAt: string
  total: number
  invoiceNo: number
  nullReason: string | null
  expiration_date: string
  tax_number: string
  pending_balance: number
  nulledBy: string
  orders: InvoiceOrder[]
  transactions: InvoiceTransaction[]
}
export type FullQuote = {
  id: string
  user_id: string
  customer_id: string
  tax: number
  subtotal: number
  discount: number
  createdAt: string
  total: number
  quote_number: number
  expiration_date: string
  orders: InvoiceOrder[]
}

export type Invoice = {
  id: string
  invoiceNo: number
  customer_id: string
  expirationDate: string
  createdAt: string
  status: string
  total: number
  name: string
  username: string
}

export type Quote = {
  id: string
  quote_number: number
  customer_id: string
  createdAt: string
  total: number
}

export type OrderState = {
  productId: string
  quantity: number
  amount: number
  productPrice: number
}
export type InvoiceTableState = {
  invoiceNo: number
  customerId: string
  customerName: string
  date: Date
  amount: number
}
export type QuoteTableState = {
  quote_number: number
  customerId: string
  customerName: string
  date: Date
  amount: number
}

export type InvoiceStatus = 'Pending' | 'Paid' | 'Active' | 'Nulled'
export type InvoiceFormState = {
  customerId: string
  expirationDate: string
  userId: string
  total: number
  subtotal: number
  status: InvoiceStatus
  discount: number
  tax: number
  orders: OrderState[]
  createdAt: string
  transactionLocation?: 'Bank' | 'Cashier'
  vendorId: string | undefined
}
export type QuoteFormState = {
  customerId: string
  expirationDate: string
  userId: string
  total: number
  subtotal: number
  discount: number
  tax: number
  orders: OrderState[]
}

export type InvoicePageState = {
  retrieve: boolean
  updateInvoices: boolean
  createViewOpen: boolean
  loadingInvoices: boolean
  formState: InvoiceFormState
  invoiceTable: InvoiceTableState
  invoices: Invoice[]
  orderForm: OrderState
  viewModalOpen: boolean
  useTax: boolean
  invoiceViewData: FullInvoice | null
  loadingFullInvoice: boolean
  nullingForm: {
    reason: string
    nullFormOpen: boolean
    invoiceId: string
    confirm: string
  }
  refreshData: boolean
  pendingInvoices: InvoiceWithTransaction[]
  loadingPendingInvoices: boolean
  invoiceAccountsViewOpen: boolean
  expiredInvoices: ExpiredInvoice[]
  loadingExpiredInvoice: boolean
}
export type QuotePageState = {
  createViewOpen: boolean
  loadingQuotes: boolean
  formState: QuoteFormState
  quoteTable: QuoteTableState
  quotes: Quote[]
  orderForm: OrderState
  viewModalOpen: boolean
  useTax: boolean
  quoteViewData: FullQuote | null
  loadingFullQuote: boolean
}

/**
 * @ProductColumns Maps Product columns name
 */
export type ProductColumns = 'id' | 'name' | 'price' | 'details'

/**
 * @CustomerColumn map Customer columns name
 * */
export type CustomerColumn = 'id' | 'name' | 'address' | 'tax_id'
/**
 * @UserColumn map User columns name
 * */
export type UserColumn = 'id' | 'username' | 'role'
/**
 * @UserColumn map User columns name
 * */
export type SessionsColumn =
  | 'id'
  | 'user_id'
  | 'session_token'
  | 'updated_at'
  | 'created_at'
  | 'expires'

/**
 * @TableNames Specific for Conteo Application
 * */
export type ConteoTables =
  | 'Product'
  | 'Invoices'
  | 'InvoiceItem'
  | 'Customer'
  | 'Sessions'
  | 'User'

export type TaxCategories = {
  starting_number: number
  current_number_used: number
  type: TaxReceiptType
}

export type GeneratedReport = {
  createdAt: string
  total: number
  status: string
  expiration_date: string
  invoiceNo: number
  name: string
  username: string
  vendor_name: string
}
export type ReportByDate = {
  from: string
  to: string
  customerId: string
  productId: string
}

export interface ExtendedInvoice {
  invoices: Invoice[]
  meta?: {
    totalRowCount: number
  }
}

export type Vendor = {
  id: string
  vendor_name: string
  created_at: string
  updated_at: string
  active: boolean
}
