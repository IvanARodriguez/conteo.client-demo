import { DashboardState } from '@/types'

export const state: DashboardState = {
  weekStatus: {
    customerWithMostPurchases: { customer_id: '', total_invoices: '' },
    weeklySummaries: {},
    yearSummary: { amountSold: 0, invoiceTotal: 0 },
    monthSummary: { amountSold: 0, invoiceTotal: 0 },
    todaySales: {
      dayOrderTotal: 0,
      soldToday: 0,
    },
    weeklySales: {
      amountSold: 0,
      invoiceTotal: 0,
    },
    mostSoldProduct: {
      productId: '',
      total_sold: '',
    },
    yearRevenue: {
      Enero: {
        name: '',
        value: 0,
      },
      Febrero: {
        name: '',
        value: 0,
      },
      Marzo: {
        name: '',
        value: 0,
      },
      Abril: {
        name: '',
        value: 0,
      },
      Mayo: {
        name: '',
        value: 0,
      },
      Junio: {
        name: '',
        value: 0,
      },
      Julio: {
        name: '',
        value: 0,
      },
      Agosto: {
        name: '',
        value: 0,
      },
      Septiembre: {
        name: '',
        value: 0,
      },
      Octubre: {
        name: '',
        value: 0,
      },
      Noviembre: {
        name: '',
        value: 0,
      },
      Diciembre: {
        name: '',
        value: 0,
      },
    },
  },
  loadingWeekStatus: false,
}
