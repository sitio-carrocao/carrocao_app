import type EProductStockStatus from '@enums/productStockStatus'
import HttpClient from '@services/core/HttpClient'
import ImageService from '@services/image/ImageService'
import { HttpStatusCode } from 'axios'
import { Platform } from 'react-native'

import type ICreateProductInputData from './dtos/create/InputData'
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

interface ICreateBody {
  active: boolean
  barcode: string | null
  maximum_stock: number
  minimum_stock: number
  model: string | null
  name: string
  observation: string
  pictures: string[]
  type_product_id: number
  type_stock_id: number
  unit_measurement_id: number
  suggestedAddress: string
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

  public async create(inputData: ICreateProductInputData): Promise<void> {
    const images = []
    for await (const image of inputData.images) {
      const response = await ImageService.uploadImage({
        file: {
          uri:
            Platform.OS === 'ios'
              ? image.uri.replace('file://', '')
              : image.uri,
          name: image.fileName,
          type: image.mimeType,
        },
      })
      images.push(response.url)
    }
    const body: ICreateBody = {
      active: inputData.active,
      barcode: inputData.barcode,
      maximum_stock: inputData.min,
      minimum_stock: inputData.max,
      model: inputData.model,
      name: inputData.name,
      observation: inputData.observation,
      pictures: images,
      type_product_id: inputData.productType,
      type_stock_id: inputData.stockType,
      unit_measurement_id: inputData.unitMensuare,
      suggestedAddress: inputData.suggestedAddress,
    }
    await HttpClient.post<ICreateBody>({
      path: `app/stock/register-product/${inputData.id}`,
      body,
    })
  }
}

export default new ProductService()
