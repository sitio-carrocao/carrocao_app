import type EProductStockStatus from '@enums/productStockStatus'

interface IInternalRequestCart extends IProduct {
  quantitySelected: number
}

interface IProduct {
  active: boolean
  id: number
  name: string
  picture: string[]
  quantity: number
  stockStatus: EProductStockStatus
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

export type { IInternalRequestCart }

export default IProduct
