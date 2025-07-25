import type EInternalRequestStatus from '@enums/internalRequestStatus'

interface IGetAllCollaboratorInternalRequestInputData {
  endDate: string
  page?: number
  rowsPerPage?: number
  startDate: string
  status?: EInternalRequestStatus
}

export default IGetAllCollaboratorInternalRequestInputData
