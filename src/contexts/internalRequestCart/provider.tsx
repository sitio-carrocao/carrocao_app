import toast from '@components/ui/toast'
import { useStorageState } from '@config/useStorageState'
import storageKeys from '@constants/storageKeys'
import type IProduct from '@models/Product'
import type { IInternalRequestCart } from '@models/Product'
import { createContext, type PropsWithChildren, useCallback } from 'react'

import type { Product, UseInternalRequestCart } from './index'

const InternalRequestCartContext = createContext<UseInternalRequestCart>({
  removeAll: () => null,
  removeProduct: () => null,
  updateQuantity: () => null,
  addProduct: () => null,
  products: [],
  isLoading: false,
})

const InternalRequestCartProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, cart], setCart] = useStorageState(storageKeys.cart)

  const removeAll = useCallback((): void => {
    setCart(null)
  }, [setCart])

  const removeProduct = useCallback(
    (id: number): void => {
      const stateParsed: IInternalRequestCart[] = cart ? JSON.parse(cart) : []
      const newState = stateParsed.filter(item => item.id !== id)
      const newCart = JSON.stringify(newState)
      setCart(newCart)
      toast.show({
        message: 'Produto removido do carrinho!',
        title: 'Sucesso',
        type: 'success',
      })
    },
    [setCart, cart]
  )

  const addProduct = useCallback(
    (product: Product): void => {
      const stateParsed: IInternalRequestCart[] = cart ? JSON.parse(cart) : []
      const productExists = stateParsed.find(item => item.id === product.id)
      if (productExists) {
        return
      }
      const newState = stateParsed.concat({ ...product, quantitySelected: 1 })
      const newCart = JSON.stringify(newState)
      setCart(newCart)
      toast.show({
        message: 'Produto adicionado ao carrinho!',
        title: 'Sucesso',
        type: 'success',
      })
    },
    [setCart, cart]
  )

  const updateQuantity = useCallback(
    (id: number, quantity: number): void => {
      const stateParsed: IInternalRequestCart[] = cart ? JSON.parse(cart) : []
      const product = stateParsed.find(item => item.id === id)
      if (product) {
        product.quantitySelected = quantity
      }
      const newCart = JSON.stringify(stateParsed)
      setCart(newCart)
    },
    [setCart, cart]
  )

  return (
    <InternalRequestCartContext.Provider
      value={{
        removeAll,
        removeProduct,
        addProduct,
        updateQuantity,
        products: cart ? JSON.parse(cart) : [],
        isLoading,
      }}>
      {children}
    </InternalRequestCartContext.Provider>
  )
}

export { InternalRequestCartContext }
export default InternalRequestCartProvider
