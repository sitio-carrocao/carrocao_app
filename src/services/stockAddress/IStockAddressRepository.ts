import type IGetAllStockAddressesInputData from './dtos/getAll/InputData'
import type IGetAllStockAddressesOutputData from './dtos/getAll/OutputData'

interface IStockAddressRepository {
  getAll(
    inputData: IGetAllStockAddressesInputData
  ): Promise<IGetAllStockAddressesOutputData>
}

export default IStockAddressRepository
