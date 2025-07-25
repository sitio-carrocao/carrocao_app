import type EProductStockStatus from '@enums/productStockStatus'

interface IGetAllProductsOutputData {
  list: {
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
  }[]
  pagination: {
    current: number
    total: number
  }
}

export default IGetAllProductsOutputData
