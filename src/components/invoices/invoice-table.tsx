import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type UIEvent,
  useState,
} from 'react'
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_SortingState,
  MRT_Virtualizer,
} from 'material-react-table'

import 'dayjs/locale/es'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Box,
  Chip,
  ChipPropsColorOverrides,
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LayersClearIcon from '@mui/icons-material/LayersClear'
import * as store from '../../store'

import { CreateInvoiceModal } from './create-invoice-modal'
import { InvoiceView } from './invoice-view'
import { useTranslation } from '../../hooks'
import { ExtendedInvoice, Invoice } from '../../types'
import FormatCurrency from '../global/format-currency'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useInvoicesData } from '@/hooks/use-invoices-data'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountBalancesModal from './account-balances-modal'
import dayjs from 'dayjs'
import { amber, green, red } from '@mui/material/colors'
import NullifyInvoice from './nullify-invoice'
import { actions } from '@/store/application'
import { state } from '@/store/profile'

function InvoiceTable() {
  const state = store.useState()
  const actions = store.useActions()

  function useStatusColor(
    status: string,
  ): 'error' | 'warning' | 'success' | undefined {
    if (status === 'Pendiente') {
      return 'warning'
    }
    if (status === 'Pagado') {
      return 'success'
    }

    return 'error'
  }

  const tableContainerRef = useRef<HTMLDivElement>(null) //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null)

  const [globalFilter, setGlobalFilter] = useState<string>()
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const retrieve = state.invoice.retrieve
  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInvoicesData({ globalFilter, sorting, retrieve })

  const flatData = useMemo(
    () => data?.pages.flatMap((page: ExtendedInvoice) => page.invoices) ?? [],
    [data, state.invoice.updateInvoices, retrieve],
  )
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  )

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({})

  const translations = useTranslation()

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Invoice>,
    ): MRT_ColumnDef<Invoice>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
    }),
    [state.product.validationErrors],
  )

  const getCommonViewProps = useCallback(
    (
      cell: MRT_Cell<Invoice>,
    ): MRT_ColumnDef<Invoice>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
    }),
    [state.product.validationErrors],
  )

  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'invoiceNo',
        header: 'No.',
        enableColumnOrdering: false,
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: 'status',
        header: translations.invoicePage.invoice.status,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={cell.getValue<string>()}
            color={useStatusColor(cell.getValue<string>())}
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'Id',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: translations.invoicePage.invoice.customerName,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
      },
      {
        accessorKey: 'username',
        header: 'Creador',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
      },
      {
        accessorKey: 'vendor_name',
        header: translations.invoicePage.invoice.salesman,
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
          <Typography>
            {dayjs(cell.getValue<string>())
              .locale('es')
              .format('DD-MM-YYYY - h:mm a')}
          </Typography>
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
      {
        accessorKey: 'pending_balance',
        header: 'Pendiente de pago',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => <FormatCurrency value={cell.getValue<number>()} />,
      },
    ],
    [getCommonEditTextFieldProps],
  )

  function handleCreateNewRow() {
    actions.invoice.setCreateModal()
  }

  function handleDeleteRow(id: string) {
    actions.invoice.setInvoiceId(id)
    actions.invoice.setNullModal(true)
  }
  function handlePayInvoice({
    id,
    pendingBalance,
  }: {
    id: string
    pendingBalance: number
  }) {
    actions.transaction.setInvoiceFormAmount(pendingBalance)
    actions.transaction.setInvoicePendingBalance(pendingBalance)
    actions.transaction.setInvoiceFormInvoiceId(id)
    actions.transaction.setInvoiceTransactionModal(true)
  }
  async function handleViewInvoice(id: string) {
    actions.invoice.setViewModal()
    await actions.invoice.getFullInvoice(id)
  }

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0)
    } catch (error) {
      console.error(error)
    }
  }, [sorting, globalFilter, state.invoice.loadingInvoices])

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <Box
      display={'flex'}
      overflow={'auto'}
      height={'100%'}
      width={'100%'}
      flex={1}>
      <MaterialReactTable
        columns={columns}
        data={flatData}
        enablePagination={false}
        enableRowNumbers={false}
        enableColumnResizing
        enableRowVirtualization
        manualFiltering={false}
        manualSorting={false}
        enableDensityToggle={false}
        enableColumnFilters={false}
        muiTableContainerProps={{
          ref: tableContainerRef,
          sx: { maxHeight: '90%' },
          onScroll: (event: UIEvent<HTMLDivElement>) =>
            fetchMoreOnBottomReached(event.target as HTMLDivElement),
        }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
        onGlobalFilterChange={setGlobalFilter}
        onSortingChange={setSorting}
        renderBottomToolbarCustomActions={() => (
          <Typography>
            {totalFetched} de {totalDBRowCount} Facturas.
          </Typography>
        )}
        muiSearchTextFieldProps={{
          placeholder: `Buscar en ${totalDBRowCount ?? 0} facturas`,
          sx: { minWidth: '300px' },
          variant: 'outlined',
        }}
        state={{
          density: 'compact',
          globalFilter,
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
        }}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
        rowVirtualizerProps={{ overscan: 4 }}
        initialState={{ columnVisibility: { id: false, disabled: false } }}
        muiTablePaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            width: '100%',
          },
        }}
        localization={MRT_Localization_ES}
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        renderRowActionMenuItems={({ closeMenu, row }) => [
          <MenuItem
            key={0}
            onClick={() => {
              closeMenu()
              const invoiceId = row.getValue('id') as string
              if (invoiceId) handleViewInvoice(invoiceId)
            }}
            sx={{ m: 0 }}>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            Ver
          </MenuItem>,
          <MenuItem
            key={1}
            onClick={() => {
              closeMenu()
              handleDeleteRow(row.getValue<string>('id'))
            }}
            sx={{
              m: 0,
              display: state.profile.role === 'EMPLOYEE' ? 'none' : 'initial',
            }}>
            <ListItemIcon>
              <LayersClearIcon />
            </ListItemIcon>
            Anular
          </MenuItem>,
          <MenuItem
            key={2}
            disabled={row.getValue<string>('status') !== 'Pendiente'}
            onClick={() => {
              closeMenu()
              handlePayInvoice({
                id: row.getValue<string>('id'),
                pendingBalance: row.getValue<number>('pending_balance'),
              })
            }}
            sx={{ m: 0 }}>
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            Pagar
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }}>
            <Tooltip title="Crear Factura">
              <IconButton onClick={handleCreateNewRow}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Balance De Cuentas">
              <IconButton
                onClick={() => {
                  actions.invoice.toggleOpenAccountViewModal()
                }}>
                <AccountBalanceIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <CreateInvoiceModal />
      <InvoiceView />
      <NullifyInvoice />
      <AccountBalancesModal />
    </Box>
  )
}

const queryClient = new QueryClient()

const InvoiceInfiniteTable = () => (
  <QueryClientProvider client={queryClient}>
    <InvoiceTable />
  </QueryClientProvider>
)
export default InvoiceInfiniteTable
