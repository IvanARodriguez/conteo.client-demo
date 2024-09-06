import { useActions, useState } from '@/store'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'

function TaxCategoriesView() {
  const actions = useActions()
  const state = useState()
  useEffect(() => {
    actions.tax.getTaxCategories()
  }, [])
  return (
    <>
      <Typography variant="h5">Balance de comprobantes fiscales</Typography>

      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Tipo</TableCell>
              <TableCell align="left">Inicial</TableCell>
              <TableCell align="left">Corriente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.tax.taxCategories.map(cat => (
              <TableRow
                key={cat.type}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {cat.type}
                </TableCell>
                <TableCell align="left">{cat.starting_number}</TableCell>
                <TableCell align="left">{cat.current_number_used}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default TaxCategoriesView
