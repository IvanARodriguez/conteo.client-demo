import { useActions, useState } from '@/store'
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import { TaxCategories, TaxReceiptType } from '@/types'

function TaxBalanceSetup() {
  const state = useState()
  const actions = useActions()
  const helpMessages: Record<string, string> = {
    B01: 'Valido para crédito fiscal',
    B02: 'Consumidor final',
    B04: 'Notas de crédito',
    B14: 'Regimen especial',
    B15: 'Regimen especial',
    B16: 'Exportaciones',
  }
  function update(type: TaxReceiptType, inputValue: string) {
    if (Number.isNaN(Number.parseInt(inputValue))) return
    const value = Number.parseInt(inputValue)
    actions.tax.updateFormValue({ type, value })
  }
  async function updateDatabase(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: TaxReceiptType,
  ) {
    e.preventDefault()
    await actions.tax.updateTaxCategory(type)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: 'fit-content',
        margin: '0 auto',
        gap: '1rem',
      }}>
      {state.tax.taxCategories.map(cat => (
        <Paper
          component={'form'}
          sx={{
            display:
              cat.current_number_used > cat.starting_number ? 'none' : 'flex',
            gap: '.5rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={cat.type}>
          <TextField
            onChange={e => update(cat.type, e.target.value)}
            fullWidth
            helperText={`${cat.type && helpMessages[cat.type]}`}
            disabled={cat.current_number_used > cat.starting_number}
            type="number"
            value={
              cat.type === 'B01'
                ? state.tax.updateFormB01
                : cat.type === 'B02'
                  ? state.tax.updateFormB02
                  : cat.type === 'B04'
                    ? state.tax.updateFormB04
                    : cat.type === 'B14'
                      ? state.tax.updateFormB14
                      : cat.type === 'B15'
                        ? state.tax.updateFormB15
                        : state.tax.updateFormB16
            }
            label={`Valor inicial de ${cat.type}`}
          />
          <LoadingButton
            variant="text"
            onClick={e => updateDatabase(e, cat.type)}>
            <SaveIcon />
          </LoadingButton>
        </Paper>
      ))}
    </Box>
  )
}

export default TaxBalanceSetup
