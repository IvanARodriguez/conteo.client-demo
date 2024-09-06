import { ExtendedInvoice } from '@/types'
import { store } from '@/utils'
import { useInfiniteQuery } from '@tanstack/react-query' // Assuming QueryClient is available for managing cache
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table'
import { enqueueSnackbar } from 'notistack'

export function useInvoicesData({
  globalFilter,
  sorting,
  retrieve,
}: {
  globalFilter?: string
  sorting: MRT_SortingState
  retrieve: boolean
}) {
  const state = store.useState()
  const fetchData = async ({ pageParam }: { pageParam: number | any }) => {
    try {
      const queryParams = new URLSearchParams({
        pageParam: String(pageParam * 25),
        globalFilter: globalFilter ?? '',
        size: String(25),
      })
      const url = `/api/invoice?${queryParams.toString()}`
      const response = await fetch(url)

      if (!response.ok) {
        const errorResponse = await response.json()
        const errorMessage =
          errorResponse.detail ||
          errorResponse.message ||
          'Error inesperado al buscar las facturas'
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return { invoices: [], meta: { totalRowCount: 0 } }
      }

      const json = (await response.json()) as ExtendedInvoice
      return json
    } catch (error) {
      enqueueSnackbar('Error inesperado al buscar las facturas', {
        variant: 'error',
      })
      return { invoices: [], meta: { totalRowCount: 0 } }
    }
  }

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<ExtendedInvoice>({
      queryKey: [
        'table-data',
        globalFilter, //refetch when globalFilter changes
        sorting, //refetch when sorting changes
        state.invoice.refreshData, //refetch when data is refreshed
        retrieve,
      ],
      queryFn: fetchData,
      initialPageParam: 0,
      getNextPageParam: (_lastGroup: any, groups: any) => groups.length,
      refetchOnWindowFocus: false,
    })

  return { data, fetchNextPage, isError, isFetching, isLoading }
}
