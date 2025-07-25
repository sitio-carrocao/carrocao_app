import type EExternalRequestStatus from '@enums/externalRequestStatus'

interface IGetExternalRequestDetailsOutputData {
  admin: {
    id: number
    name: string
  }
  solicitation: {
    brand: string | null
    color: string | null
    date: string
    details: string | null
    id: number
    model: string | null
    pictures: string[]
    product: string
    quantity: number
    status: EExternalRequestStatus
    whereUsed: string | null
  }
}

export default IGetExternalRequestDetailsOutputData
