import { useStorageState } from '@config/useStorageState'
import storageKeys from '@constants/storageKeys'
import type IStockRequestTaskOutputData from '@services/stock/dtos/stockRequestTask/OutputData'
import StockService from '@services/stock/StockService'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import type { UseSeparation } from './index'

const SeparationContext = createContext<UseSeparation>({
  clear: () => null,
  setAddress: () => null,
  data: null,
  isLoading: false,
  handleLoadingSeparation: () => null,
})

const SeparationProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [[_, separation], setSeparation] = useStorageState(
    storageKeys.separation
  )

  const clear = useCallback((): void => {
    setSeparation(null)
  }, [setSeparation])

  const setAddress = useCallback(
    ({
      addressId,
      productId,
      qrcode,
    }: {
      qrcode: string
      addressId: string
      productId: string
    }): void => {
      const stateParsed: IStockRequestTaskOutputData = separation
        ? JSON.parse(separation)
        : null
      const newState: IStockRequestTaskOutputData = {
        products: stateParsed.products.map(product => {
          if (qrcode === addressId && Number(productId) === product.id) {
            return {
              ...product,
              validateAddress: true,
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
    },
    [separation, setSeparation]
  )

  const setProduct = useCallback(
    ({ productId, barcode }: { barcode: string; productId: string }): void => {
      const stateParsed: IStockRequestTaskOutputData = separation
        ? JSON.parse(separation)
        : null
      const newState: IStockRequestTaskOutputData = {
        products: stateParsed.products.map(product => {
          if (Number(productId) === product.id && barcode === product.barcode) {
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
    },
    [separation, setSeparation]
  )

  const handleLoadingSeparation = useCallback(async () => {
    setIsLoading(true)
    const response = await StockService.stockRequestVerifyTask()
    setSeparation(
      JSON.stringify({
        ...response,
        products: response.products.map(item => ({
          ...item,
          validateAddress: false,
          validateProduct: false,
        })),
      })
    )
    setIsLoading(false)
  }, [setSeparation])

  return (
    <SeparationContext.Provider
      value={{
        clear,
        setAddress,
        setProduct,
        data: separation ? JSON.parse(separation) : null,
        isLoading,
        handleLoadingSeparation,
      }}>
      {children}
    </SeparationContext.Provider>
  )
}

export { SeparationContext }
export default SeparationProvider
