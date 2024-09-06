export default function useAccountOrCategoryDefaultName(accountName: string) {
  if (accountName === 'Bank') return 'Banco'
  if (accountName === 'Cashier') return 'Caja'
  if (accountName === 'Sales') return 'Sales'
  if (accountName === 'default') return 'Predeterminado'
  return accountName
}
