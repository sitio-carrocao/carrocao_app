import type EValidatedProductsStatus from '@enums/validatedProductStatus'
import type IGetValidatedProductDetailsOutputData from '@services/stock/dtos/getValidatedProductDetails/OutputData'
import StockService from '@services/stock/StockService'
import StockAddressService from '@services/stockAddress/StockAddressService'
import type IGetAllProductTypesOutputData from '@services/utils/dtos/getAllProductTypes/OutputData'
import UtilsService from '@services/utils/UtilsService'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'

import type { UseStock } from './index'

export interface ITaskList {
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
    id: number
    level: string
  } | null
  validationDate: Date
  value: number
}

export interface IProductType {
  id: number
  description: string
  active: boolean
}

export interface IStockType {
  id: number
  description: string
  active: boolean
}

export interface IUnitMeasurement {
  id: number
  abbreviation: string
  name: string
  active: boolean
}

export interface IAddresses {
  column: string
  deposit: string
  id: number
  level: string
}

const StockContext = createContext<UseStock>({
  tasksLists: [],
  onLoadTasks: () => null,
  currentTask: null,
  onLoadCurrentTask: () => null,
  isLoadingCurrentTask: false,
  isLoadingTaskList: false,
  productTypes: [],
  stockTypes: [],
  unitMeasurements: [],
  addresses: [],
})

const StockProvider = ({ children }: PropsWithChildren) => {
  const [list, setList] = useState<ITaskList[]>([])
  const [currentTask, setCurrentTask] =
    useState<IGetValidatedProductDetailsOutputData | null>(null)
  const [isLoadingCurrentTask, setIsLoadingCurrentTask] =
    useState<boolean>(false)
  const [isLoadingTaskList, setIsLoadingTaskList] = useState(false)
  const [productTypes, setProductTypes] = useState<IProductType[]>([])
  const [stockTypes, setStockTypes] = useState<IStockType[]>([])
  const [unitMeasurements, setUnitMeasurements] = useState<IUnitMeasurement[]>(
    []
  )
  const [addresses, setAddresses] = useState<IAddresses[]>([])

  const handleLoadCurrentTask = useCallback(async () => {
    try {
      setCurrentTask(null)
      setIsLoadingCurrentTask(true)
      const response = await StockService.getValidatedProductDetails()
      setCurrentTask(response || null)
    } catch (error) {
    } finally {
      setIsLoadingCurrentTask(false)
    }
  }, [])

  const handleLoadTasks = useCallback(async () => {
    try {
      setIsLoadingTaskList(true)
      const response = await StockService.getValidatedProducts()
      setList(response.list)
    } catch (error) {
    } finally {
      setIsLoadingTaskList(false)
    }
  }, [])

  const handleLoadProductTypes = useCallback(async () => {
    const response = await UtilsService.getAllProductTypes()
    setProductTypes(response.list)
  }, [])

  const handleLoadStockTypes = useCallback(async () => {
    const response = await UtilsService.getAllStockTypes()
    setStockTypes(response.list)
  }, [])

  const handleLoadUnitMeasurements = useCallback(async () => {
    const response = await UtilsService.getAllUnitMeasurements()
    setUnitMeasurements(response.list)
  }, [])

  const handleLoadAddresses = useCallback(async () => {
    const response = await StockAddressService.getAll({})
    setAddresses(response.list)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadTasks()
    handleLoadCurrentTask()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadProductTypes()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadStockTypes()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadUnitMeasurements()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadAddresses()
  }, [])

  return (
    <StockContext.Provider
      value={{
        tasksLists: list,
        onLoadTasks: handleLoadTasks,
        currentTask,
        onLoadCurrentTask: handleLoadCurrentTask,
        isLoadingCurrentTask,
        isLoadingTaskList,
        productTypes,
        stockTypes,
        unitMeasurements,
        addresses,
      }}>
      {children}
    </StockContext.Provider>
  )
}

export { StockContext }
export default StockProvider
