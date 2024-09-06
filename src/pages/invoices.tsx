import { useEffect, useRef } from 'react'
import { Box, useTheme } from '@mui/material'
import MainView from '@/components/global/main-view'
import InvoiceInfiniteTable from '@/components/invoices/invoice-table'
import { store } from '@/utils'
import { dictionary } from '@/utils/dictionary'
import ConfirmationDialog from '@/components/global/confirmation-dialog'
import ViewHeader from '@/components/global/view-header'
import { useTranslation } from '@/hooks'
import InvoiceTransactionModal from '@/components/transaction/invoice-transaction-modal'
import useComponentSize from '@/hooks/use-component-size'

function Invoices() {
  const state = store.useState()
  const actions = store.useActions()
  const translations = useTranslation()
  const links = dictionary[state.application.language]?.navLinks
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.transaction.makeInvoicePayment()
    actions.invoice.reloadInvoices()
  }
  useEffect(() => {
    actions.application.setMenuSection('invoice')
    actions.application.setCurrentPage(links.invoice)
  }, [])
  return (
    <MainView>
      <Box
        p={'1rem'}
        overflow={'auto'}
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 77vh',
        }}>
        <ViewHeader title={translations.invoicePage.title ?? 'Facturas'} />

        <InvoiceInfiniteTable />
      </Box>
      <ConfirmationDialog
        open={state.application.confirmationOpen}
        type="annulate"
        question="Esta a punto de anular una factura, desea continuar?"
        advice="Una ves anulada, solo un administrador puede activarla"
      />
      <InvoiceTransactionModal onSubmit={handleSubmit} />
    </MainView>
  )
}

export default Invoices
