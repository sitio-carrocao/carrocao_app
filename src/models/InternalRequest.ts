import type EInternalRequestStatus from '@enums/internalRequestStatus'

export interface InternalRequestList {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  status: EInternalRequestStatus
}
