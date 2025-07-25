import type EProductStockStatus from '@enums/productStockStatus'
import HttpClient from '@services/core/HttpClient'
import { HttpStatusCode } from 'axios'

import type IGetAllProductsInputData from './dtos/getAllProducts/InputData'
import type IGetAllProductsOutputData from './dtos/getAllProducts/OutputData'
import type IProductRepository from './IProductRepository'

interface IGetAllResponse {
  list: {
    active: boolean
    id: number
    name: string
    picture: string[]
    quantity: number
    stock_status: EProductStockStatus
    type_product: {
      name: string
    }
    type_stock: {
      name: string
    }
    unit_measurement: {
      name: string
    }
  }[]
  pagination: {
    current: number
    total: number
  }
}

interface IGetAllParams {
  active?: '0' | '1'
  name?: string
  page?: number
  rows_per_page?: string
  stock_status?: EProductStockStatus
  type_product?: string
  type_stock?: string
  unit_measurement?: string
}

class ProductService implements IProductRepository {
  public async getAll(
    inputData: IGetAllProductsInputData
  ): Promise<IGetAllProductsOutputData> {
    const params: IGetAllParams = {
      name: inputData.name || undefined,
      page: inputData.page,
      active: '1',
    }
    const response = await HttpClient.get<IGetAllResponse, IGetAllParams>({
      path: 'app/products',
      params,
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllProductsOutputData = {
        list: [],
        pagination: {
          current: 0,
          total: 0,
        },
      }
      return output
    }
    const output: IGetAllProductsOutputData = {
      list: response.data.list.map(item => ({
        active: item.active,
        id: item.id,
        name: item.name,
        picture: item.picture,
        quantity: item.quantity,
        stockStatus: item.stock_status,
        typeProduct: {
          name: item.type_product.name,
        },
        typeStock: {
          name: item.type_product.name,
        },
        unitMeasurement: {
          name: item.unit_measurement.name,
        },
      })),
      pagination: {
        current: response.data.pagination?.current,
        total: response.data.pagination?.total,
      },
    }
    return output
  }
}

export default new ProductService()
