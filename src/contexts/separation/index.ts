import type IStockRequestTaskOutputData from '@services/stock/dtos/stockRequestTask/OutputData'
import { use } from 'react'

import { type ITaskList, SeparationContext } from './provider'

interface IUseSeparation {
  data: IStockRequestTaskOutputData | null
  clear: () => void
  setProduct: ({
    productId,
    barcode,
  }: {
    barcode: string
    productId: string
  }) => void
  tasksLists: ITaskList[]
  onLoadTasks: () => Promise<void>
  currentTask: IStockRequestTaskOutputData | null
  onLoadCurrentTask: () => Promise<void>
  isLoadingCurrentTask: boolean
  isLoadingTaskList: boolean
}

function useSeparation(): IUseSeparation {
  const value = use(SeparationContext)
  if (!value) {
    throw new Error('useSeparation must be wrapped in a <SeparationProvider />')
  }
  return value
}

export type { IUseSeparation as UseSeparation }
export default useSeparation
