import type EValidatedProductsStatus from '@enums/validatedProductStatus'

interface IGetValidatedProductDetailsOutputData {
  admin: {
    name: string | null
  }
  alreadyRegistered: boolean
  barcode: string
  description: string
  id: number
  quantity: number
  status: EValidatedProductsStatus
  suggestedAddress: {
    column: string
    deposit: string
    description: string
    id: number
    level: string
    street: string
  } | null
  unitMeasurement: string
  value: number
}

export default IGetValidatedProductDetailsOutputData
