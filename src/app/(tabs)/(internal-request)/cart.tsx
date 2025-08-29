import EmptyBox from '@assets/empty-box.png'
import InternalRequestCartItem from '@components/pages/tabs/internal-request/cart/Item'
import Button from '@components/ui/Button'
import Containers from '@components/ui/containers'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useInternalRequestCart from '@contexts/internalRequestCart'
import StockService from '@services/stock/StockService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'

export default function TabInternalRequestCart() {
  const queryClient = useQueryClient()
  const { products, removeAll } = useInternalRequestCart()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.createInternalRequest,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a solicitação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: ['internalRequest'],
      })
      router.dismissTo({
        pathname: '/(tabs)/(internal-request)',
      })
      removeAll()
      toast.show({
        message: 'Solicitação enviada com sucesso',
        title: 'PARABÉNS',
        type: 'success',
      })
    },
  })

  const onSubmit = useCallback(async (): Promise<void> => {
    await mutateAsync({
      products: products.map(item => ({
        id: item.id,
        quantity: item.quantitySelected,
        cost_center_id: item.reason.id,
      })),
    })
  }, [mutateAsync, products])

  return (
    <View style={styles.container}>
      <Containers.Scroll style={{ rowGap: 16 }}>
        {products.length ? (
          products.map(item => (
            <InternalRequestCartItem key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image style={styles.emptyImage} source={EmptyBox} />
            <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
              Nenhum produto encontrada
            </Texts.Bold>
          </View>
        )}
        {!!products.length && (
          <View style={styles.footerContainer}>
            <Button
              label="Solicitar produtos"
              disabled={isPending}
              isPending={isPending}
              onHandle={onSubmit}
            />
          </View>
        )}
      </Containers.Scroll>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
  // contentContainer: {
  //   padding: 16,
  //   rowGap: 16,
  //   flexGrow: 1,
  // },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 250,
    height: 250,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    rowGap: 16,
    // padding: 16,
  },
})
