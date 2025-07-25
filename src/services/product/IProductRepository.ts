import type IGetAllProductsInputData from './dtos/getAllProducts/InputData'
import type IGetAllProductsOutputData from './dtos/getAllProducts/OutputData'

interface IProductRepository {
  getAll(
    inputData: IGetAllProductsInputData
  ): Promise<IGetAllProductsOutputData>
}

export default IProductRepository
