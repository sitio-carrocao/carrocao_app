import HttpClient from '@services/core/HttpClient'
import { HttpStatusCode } from 'axios'

import type IGetAllStockAddressesInputData from './dtos/getAll/InputData'
import type IGetAllStockAddressesOutputData from './dtos/getAll/OutputData'
import type IStockAddressRepository from './IStockAddressRepository'

interface IGetAllResponse {
  list: {
    column: string
    deposit: string
    id: number
    level: string
  }[]
}

class StockAddressService implements IStockAddressRepository {
  public async getAll(
    inputData: IGetAllStockAddressesInputData
  ): Promise<IGetAllStockAddressesOutputData> {
    const response = await HttpClient.get<IGetAllResponse>({
      path: 'app/stock-address',
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllStockAddressesOutputData = {
        list: [],
        pagination: {
          current: 0,
          total: 0,
        },
      }
      return output
    }
    const output: IGetAllStockAddressesOutputData = {
      list: response.data.list.map(item => ({
        column: item.column,
        deposit: item.deposit,
        id: item.id,
        level: item.level,
      })),
      pagination: {
        current: 0,
        total: 0,
      },
    }
    return output
  }
}

export default new StockAddressService()
