import type IStockRequestTaskOutputData from '@services/stock/dtos/stockRequestTask/OutputData'
import { use } from 'react'

import { SeparationContext } from './provider'

interface IUseSeparation {
  data: IStockRequestTaskOutputData | null
  clear: () => void
  setProduct: ({
    productId,
    barcode,
  }: {
    barcode: string
    productId: string
  }) => void
  setAddress: ({
    qrcode,
    addressId,
    productId,
  }: {
    qrcode: string
    addressId: string
    productId: string
  }) => void
  isLoading: boolean
  handleLoadingSeparation(): Promise<void>
}

function useSeparation(): IUseSeparation {
  const value = use(SeparationContext)
  if (!value) {
    throw new Error('useSeparation must be wrapped in a <SeparationProvider />')
  }
  return value
}

export type { IUseSeparation as UseSeparation }
export default useSeparation
