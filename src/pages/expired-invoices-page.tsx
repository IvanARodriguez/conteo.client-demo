import MainView from '@/components/global/main-view'
import ExpiredInvoices from '@/components/invoices/expired-invoices'
import React from 'react'

function ExpiredInvoicesPage() {
  return (
    <MainView>
      <ExpiredInvoices />
    </MainView>
  )
}

export default ExpiredInvoicesPage
