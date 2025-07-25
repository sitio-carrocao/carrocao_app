import EmptyBox from '@assets/empty-box.png'
import InternalRequestCartItem from '@components/pages/tabs/internal-request/cart/Item'
import Button from '@components/ui/Button'
import Containers from '@components/ui/containers'
import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useInternalRequestCart from '@contexts/internalRequestCart'
import { zodResolver } from '@hookform/resolvers/zod'
import StockService from '@services/stock/StockService'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, StyleSheet, View } from 'react-native'
import { z } from 'zod'

const formSchema = z.object({
  whereUsed: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
})

export default function TabInternalRequestCart() {
  const { products, removeAll } = useInternalRequestCart()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      whereUsed: '',
    },
  })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.createInternalRequest,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a solicitação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: () => {
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

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      await mutateAsync({
        products: products.map(item => ({
          id: item.id,
          quantity: item.quantitySelected,
        })),
        whereUsed: values.whereUsed,
      })
    },
    [mutateAsync, products]
  )

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
        <View style={styles.footerContainer}>
          <Controller
            control={form.control}
            name="whereUsed"
            render={({ field: { onBlur, onChange, value }, fieldState }) => (
              <Inputs.Root
                label="Onde será utilizado"
                error={fieldState.error?.message}
                inputStyle={{ height: 100 }}
                inputProps={{
                  numberOfLines: 3,
                  multiline: true,
                  autoComplete: 'off',
                  autoCorrect: false,
                  onSubmitEditing: form.handleSubmit(onSubmit),
                  returnKeyType: 'next',
                  submitBehavior: 'newline',
                  onBlur,
                  onChangeText: onChange,
                  value,
                }}
              />
            )}
          />

          <Button
            label="Solicitar produtos"
            disabled={isPending}
            isPending={isPending}
            onHandle={form.handleSubmit(onSubmit)}
          />
        </View>
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
