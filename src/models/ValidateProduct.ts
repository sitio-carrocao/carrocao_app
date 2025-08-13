import type EValidatedProductsStatus from '@enums/validatedProductStatus'

interface IValidateProduct {
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
  validationDate: Date
  value: number
}

export default IValidateProduct
