import { use } from 'react'

import type IProduct from '@models/Product'
import type { IInternalRequestCart } from '@models/Product'
import { InternalRequestCartContext } from './provider'

interface IUseInternalRequestCart {
  products: IInternalRequestCart[]
  removeAll: () => void
  removeProduct: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  addProduct: (product: IProduct) => void
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
