import type EExternalRequestStatus from '@enums/externalRequestStatus'
import type EInternalRequestProductsStatus from '@enums/internalRequestProductsStatus'
import type EInternalRequestStatus from '@enums/internalRequestStatus'
import type EValidatedProductsStatus from '@enums/validatedProductStatus'
import HttpClient from '@services/core/HttpClient'
import ImageService from '@services/image/ImageService'
import axios, { type AxiosResponse, HttpStatusCode } from 'axios'
import { Platform } from 'react-native'

import type IAttachAdminToValidatedInputData from './dtos/attachAdminToValidated/InputData'
import type IAttachCollaboratorToStockRequestInputData from './dtos/attachCollaboratorToStockRequest/InputData'
import type ICreateExternalRequestInputData from './dtos/createExternalRequest/InputData'
import type ICreateInternalRequestInputData from './dtos/createInternalRequest/InputData'
import type ICreateProductStockInputData from './dtos/createProductStock/InputData'
import type IGetAllCollaboratorExternalRequestInputData from './dtos/getAllCollaboratorExternalRequest/InputData'
import type IGetAllCollaboratorExternalRequestOutputData from './dtos/getAllCollaboratorExternalRequest/OutputData'
import type IGetAllCollaboratorInternalRequestInputData from './dtos/getAllCollaboratorInternalRequest/InputData'
import type IGetAllCollaboratorInternalRequestOutputData from './dtos/getAllCollaboratorInternalRequest/OutputData'
import type IGetAllInternalRequestInputData from './dtos/getAllInternalRequest/InputData'
import type IGetAllInternalRequestOutputData from './dtos/getAllInternalRequest/OutputData'
import type IGetCostCentersOutputData from './dtos/getCostCenters/OutputData'
import type IGetExternalRequestDetailsInputData from './dtos/getExternalRequestDetails/InputData'
import type IGetExternalRequestDetailsOutputData from './dtos/getExternalRequestDetails/OutputData'
import type IGetInternalRequestDetailsInputData from './dtos/getInternalRequestDetails/InputData'
import type IGetInternalRequestDetailsOutputData from './dtos/getInternalRequestDetails/OutputData'
import type IGetStockRequestDetailsInputData from './dtos/getStockRequestDetails/InputData'
import type IGetStockRequestDetailsOutputData from './dtos/getStockRequestDetails/OutputData'
import type IGetValidatedProductDetailsOutputData from './dtos/getValidatedProductDetails/OutputData'
import type IGetValidatedProductsOutputData from './dtos/getValidatedProducts/OutputData'
import type IPrintIdentifyInputData from './dtos/printIdentify/InputData'
import type IPrintStockRequestInputData from './dtos/printStockRequest/InputData'
import type ISearchByBarcodeInputData from './dtos/searchByBarcode/InputData'
import type ISearchByBarcodeOutputData from './dtos/searchByBarcode/OutputData'
import type IStockRequestTaskOutputData from './dtos/stockRequestTask/OutputData'
import type IWaitingWithdrawRequestProductInputData from './dtos/waitingWithdrawRequestProduct/InputData'
import type IStockRepository from './IStockRepository'

interface ICreateExternalRequestBodyRequest {
  brand: string | null
  color: string | null
  details: string | null
  images: {
    url: string | null
  }[]
  model: string | null
  name: string
  quantity: number
  where_used: string | null
}

interface ICreateInternalRequestBodyRequest {
  products: {
    id: number
    quantity: number
    cost_center_id: number
  }[]
}

interface ICreateProductStockBodyRequest {
  batch: string | null
  id: number
  productExpiration: string | null
  stockAddressId: number
  value: number
}

interface IGetAllCollaboratorExternalRequestResponse {
  list: {
    admin: { id: number; name: string }
    date: string
    id: number
    name: string
    quantity: number
    status: EExternalRequestStatus
  }[]
  pagination: {
    current: number
    total: number
  }
}

interface IGetAllCollaboratorInternalRequestResponse {
  list: {
    admin: {
      id: number
      name: string
    }
    date: string
    employee: {
      id: number | null
      name: string | null
    }
    address: {
      column: string
      deposit: string
      id: number
      level: string
    } | null
    id: number
    status: EInternalRequestStatus
  }[]
  pagination: {
    current: number
    total: number
  }
}

interface IGetAllInternalRequestResponse {
  list: {
    admin: {
      id: number
      name: string
    }
    date: string
    employee: {
      id: number | null
      name: string | null
    }
    id: number
    status: EInternalRequestStatus
  }[]
}

interface IGetExternalRequestDetailsResponse {
  admin: {
    id: number
    name: string
  }
  solicitation: {
    brand: string | null
    color: string | null
    date: string
    details: string | null
    id: number
    model: string | null
    pictures: string[]
    product: string
    quantity: number
    status: EExternalRequestStatus
    where_used: string | null
  }
}

interface IGetInternalRequestDetailsResponse {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  address: {
    column: string
    deposit: string
    id: number
    level: string
  } | null
  products: {
    id: number
    name: string
    picture: string[]
    productId: number
    quantity: number
    status: EInternalRequestProductsStatus
    typeProduct: {
      name: string
    }
    typeStock: {
      name: string
    }
    unitMeasurement: {
      name: string
    }
  }[]
  status: EInternalRequestStatus
}

interface IGetValidatedProductsResponse {
  list: {
    admin: {
      name: string | null
    }
    alreadyRegistered: boolean
    adminSuggestedAddress: string
    barcode: string
    description: string
    id: number
    quantity: number
    status: EValidatedProductsStatus
    suggestedAddress: {
      column: string
      deposit: string
      description: string
      id: number
      level: string
      street: string
    } | null
    validationDate: Date
    value: number
  }[]
}

interface IGetValidatedProductDetailsResponse {
  admin: {
    name: string | null
  }
  adminSuggestedAddress: string
  alreadyRegistered: boolean
  barcode: string
  description: string
  id: number
  quantity: number
  status: EValidatedProductsStatus
  suggestedAddress: {
    column: string
    deposit: string
    description: string
    id: number
    level: string
    street: string
  } | null
  unitMeasurement: string
  value: number
  validateDateRequired: boolean
}

interface ISearchByBarcodeResponse {
  barcode: string
  id: number
  maximum_stock: number | null
  minimum_stock: number | null
  name: string
  unit_measurement: string
}

interface ICostCentersResponse {
  list: {
    id: number
    description: string
  }[]
}

interface IStockRequestTaskResponse {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  products: {
    addresses: {
      address: {
        column: string | null
        deposit: string
        description: string | null
        id: number
        level: string | null
        street: string | null
      }
      batch: string | null
      dueDate: Date | null
      id: number
      isBestOption: boolean
      name: string
      quantity: string
    }[]
    barcode: string | null
    id: number
    name: string
    picture: string[]
    productId: number
    quantity: number
    status: EInternalRequestProductsStatus
    typeProduct: {
      name: string
    }
    typeStock: {
      name: string
    }
    unitMeasurement: {
      name: string
    }
  }[]
  status: EInternalRequestStatus
}

class StockService implements IStockRepository {
  public async createExternalRequest(
    inputData: ICreateExternalRequestInputData
  ): Promise<void> {
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
      images.push({ url: response.url })
    }
    const body: ICreateExternalRequestBodyRequest = {
      brand: inputData.brand,
      color: inputData.color,
      details: inputData.details,
      images,
      model: inputData.model,
      name: inputData.name,
      quantity: inputData.quantity,
      where_used: inputData.whereUsed,
    }
    await HttpClient.post<void, ICreateExternalRequestBodyRequest>({
      path: 'app/stock/purchase-products',
      body,
    })
  }

  public async createInternalRequest(
    inputData: ICreateInternalRequestInputData
  ): Promise<void> {
    const body: ICreateInternalRequestBodyRequest = {
      products: inputData.products,
    }
    await HttpClient.post<void, ICreateInternalRequestBodyRequest>({
      path: 'app/stock/request-products',
      body,
    })
  }

  public async createProductStock(
    inputData: ICreateProductStockInputData
  ): Promise<void> {
    const body: ICreateProductStockBodyRequest = {
      batch: inputData.batch,
      id: inputData.id,
      productExpiration: inputData.productExpirationDate,
      stockAddressId: inputData.stockAddressId,
      value: inputData.value,
    }
    await HttpClient.post<void, ICreateProductStockBodyRequest>({
      path: 'app/stock',
      body,
    })
  }

  public async getAllCollaboratorExternalRequest(
    inputData: IGetAllCollaboratorExternalRequestInputData
  ): Promise<IGetAllCollaboratorExternalRequestOutputData> {
    const params = {
      end_date: inputData.endDate,
      name: inputData.name,
      page: inputData.page,
      rows_per_page: inputData.rowsPerPage,
      start_date: inputData.startDate,
      status: inputData.status,
    }
    const response =
      await HttpClient.get<IGetAllCollaboratorExternalRequestResponse>({
        path: 'app/stock/purchase-products',
        params,
      })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllCollaboratorExternalRequestOutputData = {
        list: [],
        pagination: {
          current: 0,
          total: 0,
        },
      }
      return output
    }
    const output: IGetAllCollaboratorExternalRequestOutputData = {
      list: response.data.list.map(item => ({
        admin: {
          id: item.admin.id,
          name: item.admin.name,
        },
        date: item.date,
        name: item.name,
        quantity: item.quantity,
        id: item.id,
        status: item.status,
      })),
      pagination: {
        current: response.data.pagination.current,
        total: response.data.pagination.total,
      },
    }
    return output
  }

  public async getAllCollaboratorInternalRequest(
    inputData: IGetAllCollaboratorInternalRequestInputData
  ): Promise<IGetAllCollaboratorInternalRequestOutputData> {
    const params = {
      end_date: inputData.endDate,
      page: inputData.page,
      rows_per_page: inputData.rowsPerPage,
      start_date: inputData.startDate,
      status: inputData.status,
    }
    const response =
      await HttpClient.get<IGetAllCollaboratorInternalRequestResponse>({
        path: 'app/stock/requests/collaborator',
        params,
      })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllCollaboratorInternalRequestOutputData = {
        list: [],
        pagination: {
          current: 0,
          total: 0,
        },
      }
      return output
    }
    const output: IGetAllCollaboratorInternalRequestOutputData = {
      list: response.data.list.map(item => ({
        admin: {
          id: item.admin.id,
          name: item.admin.name,
        },
        date: item.date,
        id: item.id,
        status: item.status,
        address: item.address,
      })),
      pagination: {
        current: response.data.pagination.current,
        total: response.data.pagination.total,
      },
    }
    return output
  }

  public async getAllInternalRequest(
    inputData: IGetAllInternalRequestInputData
  ): Promise<IGetAllInternalRequestOutputData> {
    const params = {
      status: inputData.status,
    }
    const response = await HttpClient.get<IGetAllInternalRequestResponse>({
      path: 'app/stock/requests',
      params,
    })
    if (response.status === HttpStatusCode.NoContent) {
      const output: IGetAllInternalRequestOutputData = {
        list: [],
      }
      return output
    }
    const output: IGetAllInternalRequestOutputData = {
      list: response.data.list.map(item => ({
        admin: {
          id: item.admin.id,
          name: item.admin.name,
        },
        date: item.date,
        id: item.id,
        status: item.status,
      })),
    }
    return output
  }

  public async getExternalRequestDetails(
    inputData: IGetExternalRequestDetailsInputData
  ): Promise<IGetExternalRequestDetailsOutputData> {
    const response = await HttpClient.get<IGetExternalRequestDetailsResponse>({
      path: `app/stock/purchase-products/${inputData.id}`,
    })
    const output: IGetExternalRequestDetailsOutputData = {
      admin: { id: response.data.admin.id, name: response.data.admin.name },
      solicitation: {
        brand: response.data.solicitation.brand,
        color: response.data.solicitation.color,
        date: response.data.solicitation.date,
        details: response.data.solicitation.details,
        id: response.data.solicitation.id,
        model: response.data.solicitation.model,
        pictures: response.data.solicitation.pictures,
        product: response.data.solicitation.product,
        quantity: response.data.solicitation.quantity,
        status: response.data.solicitation.status,
        whereUsed: response.data.solicitation.where_used,
      },
    }
    return output
  }

  public async getInternalRequestDetails(
    inputData: IGetInternalRequestDetailsInputData
  ): Promise<IGetInternalRequestDetailsOutputData> {
    const response = await HttpClient.get<IGetInternalRequestDetailsResponse>({
      path: `app/stock/requests/${inputData.id}`,
    })
    const output: IGetInternalRequestDetailsOutputData = {
      admin: { id: response.data.admin.id, name: response.data.admin.name },
      date: response.data.date,
      address: response.data.address,
      id: response.data.id,
      products: response.data.products.map(item => ({
        id: item.id,
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        picture: item.picture,
        status: item.status,
        typeProduct: {
          name: item.typeProduct.name,
        },
        typeStock: {
          name: item.typeStock.name,
        },
        unitMeasurement: {
          name: item.unitMeasurement.name,
        },
      })),
      status: response.data.status,
    }
    return output
  }

  public async getStockRequestDetails(
    inputData: IGetStockRequestDetailsInputData
  ): Promise<IGetStockRequestDetailsOutputData> {
    const response = await HttpClient.get<IGetInternalRequestDetailsResponse>({
      path: `app/requests/${inputData.id}`,
    })
    const output: IGetStockRequestDetailsOutputData = {
      admin: { id: response.data.admin.id, name: response.data.admin.name },
      date: response.data.date,
      id: response.data.id,
      products: response.data.products.map(item => ({
        id: item.id,
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        picture: item.picture,
        status: item.status,
        typeProduct: {
          name: item.typeProduct.name,
        },
        typeStock: {
          name: item.typeStock.name,
        },
        unitMeasurement: {
          name: item.unitMeasurement.name,
        },
      })),
      status: response.data.status,
    }
    return output
  }

  public async getValidatedProducts(): Promise<IGetValidatedProductsOutputData> {
    const response = await HttpClient.get<IGetValidatedProductsResponse>({
      path: `app/stock/validated-products`,
      params: { inStock: '0' },
    })
    const output: IGetValidatedProductsOutputData = {
      list: response.data.list.map(item => ({
        admin: { name: item.admin.name },
        alreadyRegistered: item.alreadyRegistered,
        barcode: item.barcode,
        description: item.description,
        id: item.id,
        quantity: item.quantity,
        adminSuggestedAddress: item.adminSuggestedAddress,
        suggestedAddress: item.suggestedAddress
          ? {
              column: item.suggestedAddress.column,
              deposit: item.suggestedAddress.deposit,
              id: item.suggestedAddress.id,
              level: item.suggestedAddress.level,
            }
          : null,
        status: item.status,
        value: item.value,
        validationDate: item.validationDate,
      })),
    }
    return output
  }

  public async getValidatedProductDetails(): Promise<IGetValidatedProductDetailsOutputData> {
    const response = await HttpClient.get<IGetValidatedProductDetailsResponse>({
      path: `app/stock/validated-products/admin`,
    })
    const output: IGetValidatedProductDetailsOutputData = {
      admin: { name: response.data.admin.name },
      alreadyRegistered: response.data.alreadyRegistered,
      barcode: response.data.barcode,
      description: response.data.description,
      id: response.data.id,
      quantity: response.data.quantity,
      suggestedAddress: response.data.suggestedAddress
        ? {
            column: response.data.suggestedAddress.column,
            deposit: response.data.suggestedAddress.deposit,
            id: response.data.suggestedAddress.id,
            level: response.data.suggestedAddress.level,
          }
        : null,
      status: response.data.status,
      unitMeasurement: response.data.unitMeasurement,
      value: response.data.value,
      adminSuggestedAddress: response.data.adminSuggestedAddress,
      validateDateRequired: response.data.validateDateRequired,
    }
    return output
  }

  public async attachAdminToValidated(
    inputData: IAttachAdminToValidatedInputData
  ): Promise<void> {
    await HttpClient.post<void>({
      path: `app/stock/validated-products/attach-admin`,
      body: {
        id: inputData.id,
      },
    })
  }

  public async searchByBarcode(
    inputData: ISearchByBarcodeInputData
  ): Promise<ISearchByBarcodeOutputData> {
    const response = await HttpClient.get<ISearchByBarcodeResponse>({
      path: `app/barcode/${inputData.barcode}`,
    })
    const output: ISearchByBarcodeOutputData = {
      barcode: response.data.barcode,
      id: response.data.id,
      maximumStock: response.data.maximum_stock,
      minimumStock: response.data.minimum_stock,
      name: response.data.name,
      unitMeasurement: response.data.unit_measurement,
    }
    return output
  }

  public async printStockRequest(
    inputData: IPrintStockRequestInputData
  ): Promise<void> {
    await HttpClient.get({
      path: `app/stock/requests/${inputData.id}/print`,
    })
  }

  public async attachCollaboratorToStockRequest(
    inputData: IAttachCollaboratorToStockRequestInputData
  ): Promise<void> {
    await HttpClient.post({
      path: `app/stock/requests/attach-collaborator`,
      body: {
        id: inputData.id,
      },
    })
  }

  public async stockRequestVerifyTask(): Promise<IStockRequestTaskOutputData> {
    const response = await HttpClient.get<IStockRequestTaskResponse>({
      path: `app/stock/requests/collaborator-verify`,
    })
    const output: IStockRequestTaskOutputData = {
      admin: {
        id: response.data.admin.id,
        name: response.data.admin.name,
      },
      date: response.data.date,
      id: response.data.id,
      products: response.data.products.map(item => ({
        addresses: item.addresses,
        barcode: item.barcode,
        id: item.id,
        name: item.name,
        picture: item.picture,
        productId: item.productId,
        quantity: item.quantity,
        status: item.status,
        typeProduct: item.typeProduct,
        typeStock: item.typeStock,
        unitMeasurement: item.unitMeasurement,
      })),
      status: response.data.status,
    }
    return output
  }

  public async waitingWithdrawRequestProduct(
    inputData: IWaitingWithdrawRequestProductInputData
  ): Promise<void> {
    await HttpClient.post({
      path: `app/stock/requests/${inputData.id}/waiting-withdraw`,
      body: {
        addressId: inputData.addressId,
      },
    })
  }

  public async printIdentify(
    inputData: IPrintIdentifyInputData
  ): Promise<void> {
    await HttpClient.post({
      path: `app/stock/requests/print-identify`,
      body: {
        identify: inputData.identify,
        type: inputData.type,
      },
    })
  }

  public async costCenters(): Promise<IGetCostCentersOutputData> {
    const response: AxiosResponse<ICostCentersResponse> = await axios({
      method: 'get',
      url: 'https://api-app-colaboradores.carrocao.com/financial/cost-centers?page=1&rows_per_page=400',
    })
    const output: IGetCostCentersOutputData = {
      list: response.data.list.map(item => ({
        id: item.id,
        description: item.description,
      })),
    }
    return output
  }
}

export default new StockService()
