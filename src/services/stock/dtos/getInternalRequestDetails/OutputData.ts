import type EInternalRequestProductsStatus from '@enums/internalRequestProductsStatus'
import type EInternalRequestStatus from '@enums/internalRequestStatus'

interface IGetInternalRequestDetailsOutputData {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  address: {
    column: string
    deposit: string
    id: number
    level: string
  } | null
  products: {
    id: number
    name: string
    productId: number
    quantity: number
    picture: string[]
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
  }[]
  status: EInternalRequestStatus
}

export default IGetInternalRequestDetailsOutputData
