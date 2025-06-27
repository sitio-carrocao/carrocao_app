import type EExternalRequestStatus from '@enums/externalRequestStatus'

export interface ExternalRequestList {
  admin: {
    id: number
    name: string
  }
  id: number
  name: string
  quantity: number
  date: string
  status: EExternalRequestStatus
}
