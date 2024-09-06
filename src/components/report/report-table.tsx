import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState as SortingState,
} from 'material-react-table'
import useComponentSize from '@/hooks/use-component-size'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import { GeneratedReport } from '@/types'
import { store } from '@/utils'
import { Typography } from '@mui/material'
import useCurrencyFormat from '@/hooks/use-currency-format'
import dayjs from 'dayjs'

interface RowVirtualizerType {
  scrollToIndex: (index: number) => void
}

const ReportTable = () => {
  const state = store.useState()
  const data: GeneratedReport[] = state.report.reports

  const columns = useMemo<MRT_ColumnDef<GeneratedReport>[]>(
    () => [
      {
        accessorKey: 'invoiceNo',
        header: 'No.',
        size: 100,
      },
      {
        accessorKey: 'name',
        header: 'Cliente',
      },
      {
        accessorKey: 'username',
        header: 'Vendedor',
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {dayjs(cell.getValue<string>())
              .utc(true)
              .format('DD/MM/YYYY hh:mm A')}
          </Typography>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Monto',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {useCurrencyFormat(cell.getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado de pago',
      },
      {
        accessorKey: 'expiration_date',
        header: 'Fecha de expiración',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {dayjs(cell.getValue<string>())
              .utc(true)
              .format('DD/MM/YYYY hh:mm A')}
          </Typography>
        ),
      },
    ],
    [],
  )
  const { height, ref } = useComponentSize()

  const rowVirtualizerInstanceRef = createRef<any>()

  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    try {
      const virtualizerInstance = rowVirtualizerInstanceRef.current

      if (virtualizerInstance && 'scrollToIndex' in virtualizerInstance) {
        virtualizerInstance.scrollToIndex(0)
      }
    } catch (error) {
      console.error(error)
    }
  }, [sorting])

  return (
    <MaterialReactTable
      initialState={{ columnVisibility: { id: false, disabled: false } }}
      muiTablePaperProps={{
        sx: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minWidth: { xs: '300px', md: '600px' },
        },
      }}
      muiTableContainerProps={{
        sx: {
          flex: 1,
          maxHeight: '95vh',
        },
        ref,
      }}
      columns={columns}
      data={data}
      localization={MRT_Localization_ES}
      enableStickyHeader
      enableStickyFooter
      enableBottomToolbar={false}
      enableColumnResizing
      enableColumnVirtualization={true}
      enableGlobalFilterModes
      enablePagination={false}
      enablePinning
      enableRowVirtualization
      onSortingChange={setSorting}
      state={{ isLoading: state.report.loading, sorting }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
      rowVirtualizerProps={{ overscan: 5 }}
      columnVirtualizerProps={{ overscan: 2 }}
    />
  )
}

export default ReportTable
