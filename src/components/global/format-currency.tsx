import { Box } from '@mui/material'

export default function FormatCurrency(props: {
  value: number
  type?: 'credit' | 'debit'
}) {
  return (
    <Box
      component="span"
      sx={theme => ({
        borderRadius: '0.25rem',
        maxWidth: '9ch',
        p: '0.25rem',
      })}>
      {props.type === 'credit' ? '-' : ''}
      {props.value.toLocaleString?.('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      })}
    </Box>
  )
}
