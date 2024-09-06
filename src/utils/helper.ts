export const getRowCount = (height: number, rowPixels: number) => {
  const newHeight =
    Math.ceil(height / rowPixels) === 0
      ? 5
      : Math.ceil(Math.ceil(height / rowPixels))
  return newHeight
}
/**
 * @description This function translates the default names from accounts SALES, BANK AND CASHIER.
 * @param name The name of the account to be translated
 */
export const translateAccountsName = (name: string) => {
  return name
    .replace('Sales', 'Ventas')
    .replace('Bank', 'Banco')
    .replace('Cashier', 'Caja')
}
