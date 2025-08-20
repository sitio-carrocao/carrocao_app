import type IAttachAdminToValidatedInputData from './dtos/attachAdminToValidated/InputData'
import type IAttachCollaboratorToStockRequestInputData from './dtos/attachCollaboratorToStockRequest/InputData'
import type ICreateExternalRequest from './dtos/createExternalRequest/InputData'
import type ICreateInternalRequestInputData from './dtos/createInternalRequest/InputData'
import type ICreateProductStockInputData from './dtos/createProductStock/InputData'
import type IGetAllCollaboratorExternalRequestInputData from './dtos/getAllCollaboratorExternalRequest/InputData'
import type IGetAllCollaboratorExternalRequestOutputData from './dtos/getAllCollaboratorExternalRequest/OutputData'
import type IGetAllCollaboratorInternalRequestInputData from './dtos/getAllCollaboratorInternalRequest/InputData'
import type IGetAllCollaboratorInternalRequestOutputData from './dtos/getAllCollaboratorInternalRequest/OutputData'
import type IGetAllInternalRequestInputData from './dtos/getAllInternalRequest/InputData'
import type IGetAllInternalRequestOutputData from './dtos/getAllInternalRequest/OutputData'
import type IGetExternalRequestDetailsInputData from './dtos/getExternalRequestDetails/InputData'
import type IGetExternalRequestDetailsOutputData from './dtos/getExternalRequestDetails/OutputData'
import type IGetInternalRequestDetailsInputData from './dtos/getInternalRequestDetails/InputData'
import type IGetInternalRequestDetailsOutputData from './dtos/getInternalRequestDetails/OutputData'
import type IGetStockRequestDetailsInputData from './dtos/getStockRequestDetails/InputData'
import type IGetStockRequestDetailsOutputData from './dtos/getStockRequestDetails/OutputData'
import type IGetValidatedProductDetailsOutputData from './dtos/getValidatedProductDetails/OutputData'
import type IGetValidatedProductOutputData from './dtos/getValidatedProducts/OutputData'
import type ISearchByBarcodeInputData from './dtos/searchByBarcode/InputData'
import type ISearchByBarcodeOutputData from './dtos/searchByBarcode/OutputData'
import type IStockRequestTaskOutputData from './dtos/stockRequestTask/OutputData'
import type IWaitingWithdrawRequestProductInputData from './dtos/waitingWithdrawRequestProduct/InputData'

interface IStockRepository {
  createExternalRequest(inputData: ICreateExternalRequest): Promise<void>
  createInternalRequest(
    inputData: ICreateInternalRequestInputData
  ): Promise<void>
  createProductStock(inputData: ICreateProductStockInputData): Promise<void>
  getAllCollaboratorExternalRequest(
    inputData: IGetAllCollaboratorExternalRequestInputData
  ): Promise<IGetAllCollaboratorExternalRequestOutputData>
  getAllCollaboratorInternalRequest(
    inputData: IGetAllCollaboratorInternalRequestInputData
  ): Promise<IGetAllCollaboratorInternalRequestOutputData>
  getAllInternalRequest(
    inputData: IGetAllInternalRequestInputData
  ): Promise<IGetAllInternalRequestOutputData>
  getExternalRequestDetails(
    inputData: IGetExternalRequestDetailsInputData
  ): Promise<IGetExternalRequestDetailsOutputData>
  getInternalRequestDetails(
    inputData: IGetInternalRequestDetailsInputData
  ): Promise<IGetInternalRequestDetailsOutputData>
  getStockRequestDetails(
    inputData: IGetStockRequestDetailsInputData
  ): Promise<IGetStockRequestDetailsOutputData>
  getValidatedProducts(): Promise<IGetValidatedProductOutputData>
  getValidatedProductDetails(): Promise<IGetValidatedProductDetailsOutputData>
  searchByBarcode(
    inputData: ISearchByBarcodeInputData
  ): Promise<ISearchByBarcodeOutputData>
  attachAdminToValidated(
    inputData: IAttachAdminToValidatedInputData
  ): Promise<void>
  attachCollaboratorToStockRequest(
    inputData: IAttachCollaboratorToStockRequestInputData
  ): Promise<void>
  stockRequestVerifyTask(): Promise<IStockRequestTaskOutputData>
  waitingWithdrawRequestProduct(
    inputData: IWaitingWithdrawRequestProductInputData
  ): Promise<void>
}

export default IStockRepository
