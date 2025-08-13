import type IGetAllProductTypesOutputData from './dtos/getAllProductTypes/OutputData'
import type IGetAllStockTypesOutputData from './dtos/getAllStockTypes/OutputData'
import type IGetAllUnitMeasurementsOutputData from './dtos/getAllUnitMeasurements/OutputData'

interface IUtilsRepository {
  getAllProductTypes(): Promise<IGetAllProductTypesOutputData>
  getAllStockTypes(): Promise<IGetAllStockTypesOutputData>
  getAllUnitMeasurements(): Promise<IGetAllUnitMeasurementsOutputData>
}

export default IUtilsRepository
