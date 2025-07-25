import type EInternalRequestStatus from '@enums/internalRequestStatus'

interface IGetAllInternalRequestOutputData {
  list: {
    admin: {
      id: number
      name: string
    }
    date: string
    id: number
    status: EInternalRequestStatus
  }[]
}

export default IGetAllInternalRequestOutputData
