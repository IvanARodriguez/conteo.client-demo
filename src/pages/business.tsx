import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import { Box, Divider, Tooltip, Typography, useTheme } from '@mui/material'
import { useCallback, useLayoutEffect } from 'react'

import BusinessForm from '@/components/business/business-form'
import useBusinessData from '@/hooks/use-business-data'
import ImageComponent from '@/components/image-component'
import { useNavigate } from 'react-router-dom'
import TaxCategoriesView from '@/components/tax/tax-categories-view'
import TaxBalanceSetup from '@/components/tax/tax-balance-setup'

function Business() {
  const state = store.useState()
  const theme = useTheme()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (state.profile.role === 'EMPLOYEE') {
      navigate('/')
    }
  }, [])
  const business = useBusinessData()

  return (
    <MainView>
      <Box
        sx={{
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: { md: 'auto 1fr' },
          gap: '1rem',
          width: '100%',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem',
            p: '1rem',
            minWidth: '250px',
            borderRight: {
              sm: 'none',
              md: `0.1px solid ${theme.palette.primary.main}`,
            },
          }}>
          <ImageComponent
            imgSrc={business.formattedBusinessData.logourl ?? ''}
            alt={'Business picture'}
            size={150}
            variant={'circular'}
          />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gridGap: '1rem',
              textAlign: 'start',
            }}>
            <Typography variant="h4" sx={{ gridColumn: 'span 2' }}>
              {business.formattedBusinessData.name || 'Desconocido'}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Typography variant="caption">Dirección:</Typography>
            <Typography variant="caption">
              {business.formattedBusinessData.address || 'Desconocido'}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Typography variant="caption">Teléfono:</Typography>
            <Typography variant="caption">
              {business.formattedBusinessData.phone}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Typography variant="caption">Correo Electrónico:</Typography>
            <Typography variant="caption">
              {business.formattedBusinessData.email}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Typography variant="caption">Ultima actualización:</Typography>
            <Typography variant="caption">
              {business.formattedBusinessData.updatedAt}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Typography variant="caption">Fecha de creación:</Typography>
            <Typography variant="caption">
              {business.formattedBusinessData.createdAt}
            </Typography>
            <Divider sx={{ gridColumn: 'span 2' }} />
            <Tooltip title="Numero de contribuyente">
              <Typography variant="caption">RNC:</Typography>
            </Tooltip>
            <Typography variant="caption">
              {business.formattedBusinessData.rnc}
            </Typography>
          </Box>
          <TaxCategoriesView />
        </Box>
        <Box
          sx={{
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
          }}>
          <BusinessForm />
          <Divider />
          <Box
            width={'fit-content'}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            <Typography>Actualizar Balances de Comprobantes</Typography>
            <TaxBalanceSetup />
          </Box>
        </Box>
      </Box>
    </MainView>
  )
}

export default Business
