import type EInternalRequestProductsStatus from '@enums/internalRequestProductsStatus'
import type EInternalRequestStatus from '@enums/internalRequestStatus'

export interface IProductRequestTask {
  addresses: {
    address: {
      column: string | null
      deposit: string
      description: string | null
      id: number
      level: string | null
      street: string | null
    }
    batch: string | null
    dueDate: Date | null
    id: number
    isBestOption: boolean
    name: string
    quantity: string
  }[]
  barcode: string | null
  id: number
  name: string
  picture: string[]
  productId: number
  quantity: number
  validateProduct: boolean
  status: EInternalRequestProductsStatus
  typeProduct: {
    name: string
  }
  typeStock: {
    name: string
  }
  unitMeasurement: {
    name: string
  }
}

interface IStockRequestTaskOutputData {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  products: IProductRequestTask[]
  status: EInternalRequestStatus
}

export default IStockRequestTaskOutputData
