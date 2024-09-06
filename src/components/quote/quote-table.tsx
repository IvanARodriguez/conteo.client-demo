import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MaterialReactTableProps,
} from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LayersClearIcon from '@mui/icons-material/LayersClear'
import * as store from '../../store'

import { CreateQuoteModal } from './create-quote-modal'
import { QuoteView } from './quote-view'
import { useTranslation } from '../../hooks'
import { Invoice, Quote } from '../../types'
import FormatCurrency from '../global/format-currency'
import useComponentSize from '@/hooks/use-component-size'
import { getRowCount } from '@/utils'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import { DeleteOutline } from '@mui/icons-material'

function QuoteTable() {
  const state = store.useState()
  const actions = store.useActions()
  const { height, ref } = useComponentSize()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  })
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({})
  const translations = useTranslation()

  const customer = useMemo(
    () => state.customer.customers,
    [state.customer.customers],
  )

  const handleSaveRowEdits: MaterialReactTableProps<Quote>['onEditingRowSave'] =
    async ({ exitEditingMode, row, table }) => {
      if (!Object.keys(validationErrors).length) {
        exitEditingMode()
      }
    }

  const handleCancelRowEdits = () => {}

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Quote>,
    ): MRT_ColumnDef<Quote>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
    }),
    [state.product.validationErrors],
  )

  const getCommonViewProps = useCallback(
    (
      cell: MRT_Cell<Quote>,
    ): MRT_ColumnDef<Quote>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
    }),
    [state.product.validationErrors],
  )

  // )
  const columns = useMemo<MRT_ColumnDef<Quote>[]>(
    () => [
      {
        accessorKey: 'quote_number',
        header: 'No.',
        enableColumnOrdering: false,
        enableEditing: false,
        size: 0,
      },
      {
        accessorKey: 'id',
        header: 'Id',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: 'customer_id',
        header: translations.invoicePage.invoice.customerName,
        Cell: ({ cell }) => (
          <Box component={'div'}>
            {customer.length > 0
              ? customer.filter(
                  c => c.id === cell.getValue<string>().toString(),
                )[0].name
              : ''}
          </Box>
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
      },
      {
        accessorKey: 'createdAt',
        header: translations.invoicePage.invoice.date,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => (
          <Box>{new Date(cell.getValue<string>()).toLocaleString()}</Box>
        ),
      },
      {
        accessorKey: 'total',
        header: translations.invoicePage.invoice.amount,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => <FormatCurrency value={cell.getValue<number>()} />,
      },
    ],
    [getCommonEditTextFieldProps, customer],
  )

  function handleCreateNewRow() {
    actions.quote.setCreateModal()
  }

  function handleDeleteQuote(id: string) {
    actions.quote.deleteQuoteWithId(id)
  }
  function handleViewQuote(id: string) {
    actions.quote.setViewModal()
    if (state.quote.quoteViewData?.id !== id) {
      actions.quote.getFullQuote(id)
    }
  }
  useLayoutEffect(() => {
    if (state.quote.quotes.length === 0) actions.quote.getAllQuotes()
  }, [])
  useEffect(() => {
    const newHight = getRowCount(height, 72)

    setPagination({
      pageIndex: 0,
      pageSize: newHight,
    })
  }, [height])
  return (
    <Box
      display={'flex'}
      overflow={'auto'}
      height={'100%'}
      width={'100%'}
      flex={1}>
      <MaterialReactTable
        state={{ isLoading: state.quote.loadingQuotes, pagination }}
        initialState={{ columnVisibility: { id: false, disabled: false } }}
        onPaginationChange={state => setPagination(state)}
        muiTablePaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            width: '100%',
          },
        }}
        muiTableContainerProps={{
          sx: {
            flex: 1,
          },
          ref,
        }}
        columns={columns}
        data={state.quote.quotes}
        localization={MRT_Localization_ES}
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        enableStickyHeader
        enableStickyFooter
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="right" title="View">
              <IconButton
                onClick={() => {
                  const invoiceId = row.getValue('id') as string
                  if (invoiceId) handleViewQuote(invoiceId)
                }}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <span>
                <IconButton
                  onClick={() => {
                    const invoiceId = row.getValue('id') as string
                    if (invoiceId) handleDeleteQuote(invoiceId)
                  }}>
                  <DeleteOutline />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '100rem',
              p: 0,
            }}
            color="primary"
            onClick={handleCreateNewRow}
            variant="text">
            {translations.buttonAction.create}
          </Button>
        )}
      />
      <CreateQuoteModal />
      <QuoteView />
    </Box>
  )
}

export default QuoteTable

export function ViewElementDetails() {}

const validateRequired = (value: string) => !!value.length
const validateNumber = (value: any) => typeof value !== 'number'
