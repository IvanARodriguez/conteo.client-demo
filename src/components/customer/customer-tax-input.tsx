import { useActions } from '@/store'
import { TaxReceiptType } from '@/types'
import { store } from '@/utils'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'

function CustomerTaxInput() {
  const actions = useActions()
  const state = store.useState()
  const options: TaxReceiptType[] = ['B01', 'B02', 'B04', 'B14', 'B15', 'B16']
  return (
    <Box>
      <Autocomplete
        onChange={(e, value) =>
          actions.customer.setCustomerProp({
            option: 'tax',
            value: value,
          })
        }
        value={state.customer.customerForm.tax_type}
        disablePortal
        id="tax"
        options={options}
        renderInput={(params: any) => (
          <TextField {...params} label="Tipo de comprobante fiscal" />
        )}
      />
      <Box>
        <li>
          <Typography variant="caption">
            B01 - Valido para crédito fiscal
          </Typography>
        </li>
        <li>
          <Typography variant="caption">B02 - Consumidor final</Typography>
        </li>
        <li>
          <Typography variant="caption">B04 - Notas de crédito</Typography>
        </li>
        <li>
          <Typography variant="caption">B14 - Regimen especial</Typography>
        </li>
        <li>
          <Typography variant="caption">
            B15 - Comprobante gubernamental
          </Typography>
        </li>
        <li>
          <Typography variant="caption">B16 - Exportaciones</Typography>
        </li>
      </Box>
    </Box>
  )
}

export default CustomerTaxInput
