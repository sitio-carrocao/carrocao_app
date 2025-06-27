import type EInternalRequestProductsStatus from '@enums/internalRequestProductsStatus'

export default interface ISolicitationProduct {
  id: number
  name: string
  picture: string[]
  quantity: number
  barcode: string
  status: EInternalRequestProductsStatus
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
