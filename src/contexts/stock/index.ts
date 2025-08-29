import type IGetValidatedProductDetailsOutputData from '@services/stock/dtos/getValidatedProductDetails/OutputData'
import { use } from 'react'

import {
  type IAddresses,
  type IProductType,
  type IStockType,
  type ITaskList,
  type IUnitMeasurement,
  StockContext,
} from './provider'

interface IUseStock {
  tasksLists: ITaskList[]
  onLoadTasks: () => Promise<void>
  currentTask: IGetValidatedProductDetailsOutputData | null
  onLoadCurrentTask: () => Promise<void>
  isLoadingCurrentTask: boolean
  isLoadingTaskList: boolean
  productTypes: IProductType[]
  stockTypes: IStockType[]
  unitMeasurements: IUnitMeasurement[]
  addresses: IAddresses[]
}

function useStock(): IUseStock {
  const value = use(StockContext)
  if (!value) {
    throw new Error('useStock must be wrapped in a <StockProvider />')
  }
  return value
}

export type { IUseStock as UseStock }
export default useStock
