function useFormattedCurrency(amount: number) {
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatCurrency.format(amount)
}

export default useFormattedCurrency
