import HttpClient from '@services/core/HttpClient'
import { HttpStatusCode } from 'axios'

import type IGetAllProductTypesOutputData from './dtos/getAllProductTypes/OutputData'
import type IGetAllStockTypesOutputData from './dtos/getAllStockTypes/OutputData'
import type IGetAllUnitMeasurementsOutputData from './dtos/getAllUnitMeasurements/OutputData'
import type IUtilsRepository from './IUtilsRepository'

interface IGetAllProductTypes {
  list: {
    id: number
    description: string
    active: boolean
  }[]
}

interface IGetAllStockTypes {
  list: {
    id: number
    description: string
    active: boolean
  }[]
}

interface IGetAllUnitMeasurements {
  list: {
    id: number
    abbreviation: string
    name: string
    active: boolean
  }[]
}

class UtilsService implements IUtilsRepository {
  public async getAllProductTypes(): Promise<IGetAllProductTypesOutputData> {
    const response = await HttpClient.get<IGetAllProductTypes>({
      path: 'app/types-product',
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllProductTypesOutputData = {
        list: [],
      }
      return output
    }
    const output: IGetAllProductTypesOutputData = {
      list: response.data.list.map(item => ({
        active: item.active,
        description: item.description,
        id: item.id,
      })),
    }
    return output
  }

  public async getAllStockTypes(): Promise<IGetAllStockTypesOutputData> {
    const response = await HttpClient.get<IGetAllStockTypes>({
      path: 'app/types-stock',
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllStockTypesOutputData = {
        list: [],
      }
      return output
    }
    const output: IGetAllStockTypesOutputData = {
      list: response.data.list.map(item => ({
        active: item.active,
        description: item.description,
        id: item.id,
      })),
    }
    return output
  }

  public async getAllUnitMeasurements(): Promise<IGetAllUnitMeasurementsOutputData> {
    const response = await HttpClient.get<IGetAllUnitMeasurements>({
      path: 'app/units-measurement',
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllUnitMeasurementsOutputData = {
        list: [],
      }
      return output
    }
    const output: IGetAllUnitMeasurementsOutputData = {
      list: response.data.list.map(item => ({
        active: item.active,
        name: item.name,
        abbreviation: item.abbreviation,
        id: item.id,
      })),
    }
    return output
  }
}

export default new UtilsService()
