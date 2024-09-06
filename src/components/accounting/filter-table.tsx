import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MRT_Row, MaterialReactTable } from 'material-react-table'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import BorderAllIcon from '@mui/icons-material/BorderAll'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import { jsPDF } from 'jspdf' //or use your library of choice here
import autoTable from 'jspdf-autotable'
import { v4 as uuidv4 } from 'uuid'
import { AccountTransaction } from '@/types'
import { store } from '@/utils'
import useAccountOrCategoryDefaultName from '@/hooks/use-default-account-name'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
  filename: `Reporte - ${new Date().toLocaleString()} - ${uuidv4()}`,
})

const FilterTable = () => {
  const state = store.useState()
  const rowVirtualizerInstanceRef = useRef(null)

  const transactionsData = state.accounting.accountsTransactions

  const debitTotalAmount = useMemo(() => {
    const mappedData = transactionsData
      .filter(trans => trans.transaction_type === 'debit')
      .map(trans => trans.debitAmount)
    return mappedData.length > 0
      ? mappedData.reduce((prev, curr) => (prev += curr))
      : 0
  }, [transactionsData])

  const creditTotalAmount = useMemo(() => {
    const mappedData = transactionsData
      .filter(trans => trans.transaction_type === 'credit')
      .map(trans => trans.creditAmount)
    return mappedData.length > 0
      ? mappedData.reduce((prev, curr) => (prev += curr))
      : 0
  }, [transactionsData])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportData = () => {
    handleClose()
    const csv = generateCsv(csvConfig)(transactionsData)
    download(csvConfig)(csv)
  }

  const columns: any = useMemo(
    () => [
      {
        header: 'Cuenta',
        accessorKey: 'account_name',
        size: 100,
      },
      {
        header: 'Categoría',
        accessorKey: 'category_name',
        size: 150,
        Cell: ({ cell }: any) => (
          <Typography
            sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
            variant="caption"
            component={'p'}>
            {useAccountOrCategoryDefaultName(cell.getValue())}
          </Typography>
        ),
      },

      {
        header: 'Débito',
        accessorKey: 'debitAmount',
        AggregatedCell: ({ cell, table }: any) => (
          <Box sx={{ color: 'success.main', fontWeight: 'bold' }}>
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }: any) => (
          <>
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </>
        ),
        Footer: () => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Stack>
              Total débito:
              <Box color="success.main">
                {debitTotalAmount?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            </Stack>
          </Box>
        ),
        size: 170,
      },
      {
        header: 'Crédito',
        accessorKey: 'creditAmount',
        AggregatedCell: ({ cell, table }: any) => (
          <Box sx={{ color: 'error.main', fontWeight: 'bold' }}>
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }: any) => (
          <>
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </>
        ),
        Footer: () => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Stack>
              Total crédito:
              <Box color="error.main">
                {creditTotalAmount?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            </Stack>
          </Box>
        ),
        size: 170,
      },
      {
        header: 'Agente',
        accessorKey: 'username',
        enableGrouping: false,
        size: 70,
      },

      {
        header: 'Fecha',
        accessorKey: 'createdAt',
        // You can customize the Cell render function for date formatting
        Cell: ({ cell }: any) => (
          <Box>{new Date(cell.getValue()).toLocaleString()}</Box>
        ),
        size: 100,
      },
      {
        header: 'Tipo de transacción',
        size: 80,
        accessorKey: 'transaction_type',
        Cell: ({ cell }: any) => (
          <Box
            sx={{
              color: cell.getValue().toString().includes('cred')
                ? 'error.main'
                : 'success.main',
            }}>
            {cell.getValue()}
          </Box>
        ),
      },
      {
        header: 'Descripción',
        accessorKey: 'description',
        size: 200,
        Cell: ({ cell }: any) => (
          <Typography
            sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
            variant="caption"
            component={'p'}>
            {cell.getValue() === ''
              ? 'Transacción sin descripción'
              : cell.getValue()}
          </Typography>
        ),
      },
    ],
    [transactionsData],
  )
  const handleExportToPDF = (rows: MRT_Row<AccountTransaction>[]) => {
    const doc = new jsPDF()
    const tableData = rows.map(row => Object.values(row.original))
    const tableHeaders = columns.map((c: any) => c.header)

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    })

    doc.save(`Reporte - ${new Date().toLocaleString()} - ${uuidv4()}.pdf`)
  }

  return (
    <MaterialReactTable
      columns={columns}
      data={transactionsData}
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      enableBottomToolbar={false}
      enablePagination={false}
      enableRowVirtualization
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      state={{
        isLoading: state.accounting.loadingFilteredTransactions,
      }}
      localization={MRT_Localization_ES}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap',
          }}>
          <div>
            <Button
              id="demo-customized-button"
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
              size="small"
              endIcon={<KeyboardArrowDownIcon />}>
              Descargar
            </Button>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <MenuItem onClick={handleExportData} disableRipple>
                <BorderAllIcon />
                Exportar a Excel
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleExportToPDF(table.getPrePaginationRowModel().rows)
                }
                disableRipple>
                <FileDownloadIcon />
                Exportar a PDF
              </MenuItem>
            </StyledMenu>
          </div>
        </Box>
      )}
      initialState={{
        density: 'compact',
        grouping: ['account_name', 'category_name'], //an array of columns to group by by default (can be multiple)
        sorting: [{ id: 'account_name', desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
      muiTableContainerProps={{
        sx: { display: 'flex', overflow: 'auto', flex: 1, maxHeight: 650 },
      }}
    />
  )
}

export default FilterTable
