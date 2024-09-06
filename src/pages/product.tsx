import { Box } from '@mui/material'
import { useEffect } from 'react'
import MainView from '@/components/global/main-view'
import ViewHeader from '@/components/global/view-header'
import * as store from '@/store'
import { dictionary } from '@/utils/dictionary'
import ProductTable from '@/components/product/product-table'

function Product() {
  const state = store.useState()
  const actions = store.useActions()
  const translation = dictionary[state.application.language ?? 'es']

  const links = dictionary[state.application.language]?.navLinks
  useEffect(() => {
    actions.application.setMenuSection('product')
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
    actions.application.setCurrentPage(links.product)
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
        <ViewHeader title={translation.productPage.title ?? 'Productos'} />
        <ProductTable />
      </Box>
    </MainView>
  )
}

export default Product
