import toast from '@components/ui/toast'
import { useStorageState } from '@config/useStorageState'
import storageKeys from '@constants/storageKeys'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import type IStockRequestTaskOutputData from '@services/stock/dtos/stockRequestTask/OutputData'
import StockService from '@services/stock/StockService'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'

import type { UseSeparation } from './index'

export interface ITaskList {
  admin: {
    id: number
    name: string
  }
  date: string
  id: number
  status: EInternalRequestStatus
}

const SeparationContext = createContext<UseSeparation>({
  clear: () => null,
  data: null,
  isLoading: false,
  tasksLists: [],
  onLoadTasks: () => null,
  currentTask: null,
  onLoadCurrentTask: () => null,
  setProduct: () => null,
  isLoadingCurrentTask: false,
  isLoadingTaskList: false,
})

const SeparationProvider = ({ children }: PropsWithChildren) => {
  const [list, setList] = useState<ITaskList[]>([])
  const [currentTask, setCurrentTask] =
    useState<IStockRequestTaskOutputData | null>(null)
  const [isLoadingCurrentTask, setIsLoadingCurrentTask] =
    useState<boolean>(false)
  const [isLoadingTaskList, setIsLoadingTaskList] = useState(false)
  const [[_, separation], setSeparation] = useStorageState(
    storageKeys.separation
  )

  const clear = useCallback((): void => {
    setSeparation(null)
  }, [setSeparation])

  const handleLoadCurrentTask = useCallback(async () => {
    try {
      setCurrentTask(null)
      setIsLoadingCurrentTask(true)
      const response = await StockService.stockRequestVerifyTask()
      setSeparation(
        JSON.stringify({
          ...response,
          products: response.products.map(item => ({
            ...item,
            validateProduct: false,
          })),
        })
      )
      setCurrentTask(response || null)
    } catch (error) {
    } finally {
      setIsLoadingCurrentTask(false)
    }
  }, [setSeparation])

  const handleLoadTasks = useCallback(async () => {
    try {
      setIsLoadingTaskList(true)
      const response = await StockService.getAllInternalRequest({
        status: EInternalRequestStatus.WaitingForSeparation,
      })
      setList(response.list)
    } catch (error) {
    } finally {
      setIsLoadingTaskList(false)
    }
  }, [])

  const setProduct = useCallback(
    ({ productId, barcode }: { barcode: string; productId: string }): void => {
      const stateParsed: IStockRequestTaskOutputData = separation
        ? JSON.parse(separation)
        : null
      if (stateParsed) {
        const newState: IStockRequestTaskOutputData = {
          products: stateParsed.products.map(product => {
            if (
              Number(productId) === product.id &&
              barcode.padStart(13, '0') === product.barcode
            ) {
              toast.show({
                message: 'Produto verificado com sucesso',
                title: 'Parabéns',
                type: 'success',
              })
              return {
                ...product,
                validateProduct: true,
              }
            }
            return product
          }),
          admin: stateParsed.admin,
          date: stateParsed.date,
          id: stateParsed.id,
          status: stateParsed.status,
        }
        setSeparation(JSON.stringify(newState))
      } else {
        setSeparation(null)
      }
    },
    [separation, setSeparation]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadTasks()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoadCurrentTask()
  }, [])

  return (
    <SeparationContext.Provider
      value={{
        clear,
        setProduct,
        data: separation ? JSON.parse(separation) : null,
        tasksLists: list,
        onLoadTasks: handleLoadTasks,
        currentTask,
        onLoadCurrentTask: handleLoadCurrentTask,
        isLoadingCurrentTask,
        isLoadingTaskList,
      }}>
      {children}
    </SeparationContext.Provider>
  )
}

export { SeparationContext }
export default SeparationProvider
