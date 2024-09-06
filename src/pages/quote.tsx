import ConfirmationDialog from '@/components/global/confirmation-dialog'
import MainView from '@/components/global/main-view'
import ViewHeader from '@/components/global/view-header'
import QuoteTable from '@/components/quote/quote-table'
import { useTranslation } from '@/hooks'
import { store } from '@/utils'
import { dictionary } from '@/utils/dictionary'
import { Box, useTheme } from '@mui/material'
import { useLayoutEffect } from 'react'

function Quote() {
  const state = store.useState()
  const actions = store.useActions()
  const translations = useTranslation()
  const links = dictionary[state.application.language]?.navLinks
  useLayoutEffect(() => {
    actions.application.setMenuSection('invoice')
    actions.application.setCurrentPage(links.quote)
  }, [])
  return (
    <MainView>
      <Box
        p={'1rem'}
        display={'grid'}
        gridTemplateRows={'auto 1fr'}
        overflow={'auto'}
        flexDirection={'column'}
        minHeight={'100vh'}>
        <ViewHeader title={translations.quotePage.title ?? 'Cotización'} />
        <QuoteTable />
        <ConfirmationDialog
          type="annulate"
          open={state.application.confirmationOpen}
          question="Esta a punto de anular una factura, desea continuar?"
          advice="Una ves anulada, solo un administrador puede activarla"
        />
      </Box>
    </MainView>
  )
}

export default Quote
