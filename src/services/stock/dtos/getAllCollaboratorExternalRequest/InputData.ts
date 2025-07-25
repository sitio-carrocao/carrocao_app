import type EExternalRequestStatus from '@enums/externalRequestStatus'

interface IGetAllCollaboratorExternalRequestInputData {
  endDate: string
  name?: string
  page?: number
  rowsPerPage?: number
  startDate: string
  status?: EExternalRequestStatus
}

export default IGetAllCollaboratorExternalRequestInputData
