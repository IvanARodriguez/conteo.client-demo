import { Box, Paper, Skeleton, Typography, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import { store } from '@/utils'
import FormatCurrency from '../global/format-currency'
import { useEffect } from 'react'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import CallReceivedIcon from '@mui/icons-material/CallReceived'

type GlossaryProps = {
  amount?: number
  quantity: number
  loading: boolean
  bottomText?: string
  title: string
}

function Glossary(props: GlossaryProps) {
  const { amount, loading, quantity, bottomText, title } = props
  const theme = useTheme()
  if (loading) {
    return (
      <Box
        height={'100%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        component={Paper}>
        <Skeleton
          animation={'wave'}
          width={'100%'}
          height={'100%'}
          variant="rectangular"
          sx={{ '& span': { height: '100%' } }}
        />
      </Box>
    )
  }
  return (
    <Container>
      <Box
        component={Paper}
        elevation={3}
        padding={'.5rem 0 .5rem 1.5rem'}
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        gap={'.5rem'}>
        <Box
          width={'100%'}
          display={'flex'}
          flexGrow={1}
          alignItems={'start'}
          gap={'.5rem'}>
          <Box
            flexGrow={1}
            display={'flex'}
            justifyContent={'center'}
            height={'100%'}
            flexDirection={'column'}>
            <Typography variant="h6" justifySelf={'start'}>
              {title}
            </Typography>
            <Typography variant="h5" display={'flex'} flexGrow={1}>
              {FormatCurrency({
                value: amount ? amount : 0.0,
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              fontWeight: 'bold',

              background:
                amount === 0
                  ? theme.palette.error.main
                  : theme.palette.secondary.main,
              color: '#222222',
              p: '.5rem',
              width: 'fit-content',
              borderRadius: '.4rem 0 0 .4rem',
            }}>
            +{quantity}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Glossary

const Container = styled.div`
  display: flex;
  gap: 1rem;
`
