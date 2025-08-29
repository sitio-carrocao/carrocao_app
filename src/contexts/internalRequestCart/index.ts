import type IProduct from '@models/Product'
import type { IInternalRequestCart } from '@models/Product'
import { use } from 'react'

import { InternalRequestCartContext } from './provider'

export interface Product extends IProduct {
  reason: {
    id: number
    description: string
  }
}

interface IUseInternalRequestCart {
  products: IInternalRequestCart[]
  removeAll: () => void
  removeProduct: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  addProduct: (product: Product) => void
  isLoading: boolean
}

function useInternalRequestCart(): IUseInternalRequestCart {
  const value = use(InternalRequestCartContext)
  if (!value) {
    throw new Error(
      'useInternalRequestCart must be wrapped in a <InternalRequestCartProvider />'
    )
  }
  return value
}

export type { IUseInternalRequestCart as UseInternalRequestCart }
export default useInternalRequestCart
