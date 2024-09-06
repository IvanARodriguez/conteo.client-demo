import { Product, ProductForm } from '../../types'
import { createErrorResponse } from '../util'

type ErrorMessage = {
  detail: string
}

export async function deleteProduct(productId: string) {
  const res = await fetch(`/api/product/${productId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    return createErrorResponse(res)
  }

  return res
}

export async function addProduct(product: ProductForm) {
  const res = await fetch('/api/product', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  const newProduct = (await res.json()) as ProductForm
  return newProduct
}

export async function createProduct(
  product: ProductForm,
): Promise<ProductForm | null> {
  const res = await fetch('/api/product', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: product.name,
      details: product.details,
      price: product.price,
    }),
  })

  if (!res.ok) return null

  const productJson = (await res.json()) as ProductForm
  return productJson
}

export async function getProducts(): Promise<Product[] | null> {
  const res = await fetch('/api/product')

  if (!res.ok) return null

  const productJson = (await res.json()) as Product[]
  return productJson
}

type UpdateProductBodyObjects = {
  column: 'name' | 'details' | 'price' | 'inventory_managed' | 'disabled'
  value: string | number | boolean
}
export async function updateProduct({
  id,
  name,
  details,
  price,
  inventory_managed,
  disabled,
}: {
  id: string
  name: string
  details: string
  price: number
  inventory_managed: boolean
  disabled: boolean
}): Promise<Product[] | ErrorMessage> {
  const productNewValuePairs: UpdateProductBodyObjects[] = [
    { column: 'name', value: name },
    { column: 'details', value: details },
    { column: 'price', value: price },
    { column: 'inventory_managed', value: inventory_managed },
    { column: 'disabled', value: disabled },
  ]
  console.log(productNewValuePairs)
  const res = await fetch(`/api/product/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productNewValuePairs),
  })

  if (!res.ok) throw (await res.json()) as ErrorMessage

  const productJson = (await res.json()) as Product[]
  return productJson
}
