import { GeneratedReport } from '@/types'
import { store } from '@/utils'
import {
  Box,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

function groupBy<T>(collection:T[],key: keyof T){
  const groupedResult =  collection.reduce((previous,current)=>{

  if(!previous[current[key]]){
    previous[current[key]] = [] as T[]
   }

  previous[current[key]].push(current)
         return previous
  },{} as any)
    return groupedResult
}

function SalesmanEarnings() {
  const state = store.useState()
  const filteredReports = state.report.reports.filter(
    report => report.vendor_name !== null,
  )
  const vendorSales:Record<string, GeneratedReport[]> = groupBy<GeneratedReport>(filteredReports, 'vendor_name')
  const [commissionPercentage, setCommissionPercentage] = useState(0)
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return (
    <Box
      sx={{
        minHeight: '20rem',
        margin: '1rem 0',
      }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', mb: '1rem' }}>
        <Typography variant="h4">Vendedores</Typography>
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="commission-percentage">
            Porcentaje de Comisión
          </InputLabel>
          <Input
            type="number"
            onChange={e =>
              setCommissionPercentage(Number.parseFloat(e.target.value))
            }
            id="commission-percentage"
            startAdornment={<InputAdornment position="start">%</InputAdornment>}
          />
        </FormControl>
      </Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: 'repeat(4, 1fr)'},
        gap: '1rem'
      }}>
      {Object.keys(vendorSales).map(k => (
        <Paper
          key={k}
          sx={{
            padding: '.5rem',
          }}>
          <Typography variant="h5">{k}</Typography>
          <Typography variant="body2">
            Total:{' '}
            {USDollar.format(
              vendorSales[k]
                ? vendorSales[k].map((sales) => sales.total)
                    .reduce((prev, after) => prev + after, 0)
                : 0,
            )}
          </Typography>
          <Typography variant="body2">
            Pendiente:{' '}
            {USDollar.format(
              vendorSales[k]
                ? vendorSales[k]
                    .filter(sales => sales.status === 'Pending')
                    .map(sales => sales.total)
                    .reduce((prev, after) => prev + after, 0)
                : 0,
            )}
          </Typography>
          <Typography variant="body2">
            Pagada:{' '}
            {USDollar.format(
              vendorSales[k]
                ? vendorSales[k]
                    .filter(sales => sales.status === 'Paid')
                    .map(sales => sales.total)
                    .reduce((prev, after) => prev + after, 0)
                : 0,
            )}
          </Typography>
          <Typography>
            Comisión:{' '}
            {USDollar.format(
              vendorSales[k] && commissionPercentage > 0
                ? vendorSales[k]
                    .map(sales => sales.total)
                    .reduce((prev, after) => prev + after, 0) *
                    (commissionPercentage / 100)
                : 0,
            )}
          </Typography>
        </Paper>
      ))}
        </Box>
    </Box>
  )
}

export default SalesmanEarnings
