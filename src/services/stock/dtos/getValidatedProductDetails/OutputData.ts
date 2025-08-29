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
    id: number
    level: string
  } | null
  unitMeasurement: string
  value: number
  adminSuggestedAddress: string
  validateDateRequired: boolean
}

export default IGetValidatedProductDetailsOutputData
