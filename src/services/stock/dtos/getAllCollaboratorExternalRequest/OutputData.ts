import type EExternalRequestStatus from '@enums/externalRequestStatus'

interface IGetAllCollaboratorExternalRequestOutputData {
  list: {
    admin: {
      id: number
      name: string
    }
    date: string
    name: string
    quantity: number
    id: number
    status: EExternalRequestStatus
  }[]
  pagination: {
    current: number
    total: number
  }
}

export default IGetAllCollaboratorExternalRequestOutputData
