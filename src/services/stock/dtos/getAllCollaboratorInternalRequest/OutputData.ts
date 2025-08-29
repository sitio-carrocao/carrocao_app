import type EInternalRequestStatus from '@enums/internalRequestStatus'

interface IGetAllCollaboratorInternalRequestOutputData {
  list: {
    admin: {
      id: number
      name: string
    }
    date: string
    id: number
    status: EInternalRequestStatus
    address: {
      column: string
      deposit: string
      id: number
      level: string
    } | null
  }[]
  pagination: {
    current: number
    total: number
  }
}

export default IGetAllCollaboratorInternalRequestOutputData
