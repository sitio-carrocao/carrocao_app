import type ICreateProductInputData from './dtos/create/InputData'
import type IGetAllProductsInputData from './dtos/getAllProducts/InputData'
import type IGetAllProductsOutputData from './dtos/getAllProducts/OutputData'

interface IProductRepository {
  getAll(
    inputData: IGetAllProductsInputData
  ): Promise<IGetAllProductsOutputData>
  create(inputData: ICreateProductInputData): Promise<void>
}

export default IProductRepository
