import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useSeparation from '@contexts/separation'
import StockService from '@services/stock/StockService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { CircleCheck } from 'lucide-react-native'
import { useCallback, useEffect, useMemo } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export default function TabSeparationTask() {
  const queryClient = useQueryClient()
  const { data, setAddress, setProduct } = useSeparation()
  const { qrcode, addressId, productId, barcode } = useLocalSearchParams<{
    qrcode?: string
    addressId?: string
    productId?: string
    barcode?: string
  }>()

  const allValidate = useMemo(() => {
    const allValidate = data?.products.filter(
      item => !item.validateAddress || !item.validateProduct
    )
    if (allValidate?.length) {
      return false
    }
    return true
  }, [data])

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.waitingWithdrawRequestProduct,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a operação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['separationTasks'],
      })
      queryClient.resetQueries({
        queryKey: ['separationCurrentTask'],
      })
      router.dismissTo({
        pathname: '/(tabs)/(separation)',
      })
      toast.show({
        message: 'Separação realizada com sucesso',
        title: 'Parabéns',
        type: 'success',
      })
    },
  })

  const onSubmit = useCallback(async (): Promise<void> => {
    await mutateAsync({
      id: data!.id,
    })
  }, [mutateAsync, data])

  useEffect(() => {
    if (qrcode && addressId && productId) {
      setAddress({ qrcode, addressId, productId })
    }
  }, [qrcode, addressId, productId, setAddress])

  useEffect(() => {
    if (barcode && productId) {
      setProduct({ barcode, productId })
    }
  }, [productId, barcode, setProduct])

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.column}>
        <Texts.Bold style={{ fontSize: 16 }}>
          Solicitante: {data?.admin.name}
        </Texts.Bold>
        <Texts.Bold style={{ fontSize: 16 }}>
          Data: {format(parseISO(data!.date), 'dd/MM/yyyy')}
        </Texts.Bold>

        <Button
          label="Finalizar"
          disabled={!allValidate}
          isPending={isPending}
          onHandle={onSubmit}
        />
      </View>

      <Texts.Bold
        style={{
          fontSize: 24,
          color: theme.colors.primary.green,
        }}>
        Produtos
      </Texts.Bold>
      {data?.products.map(item => (
        <View key={item.id} style={styles.item}>
          <View style={styles.row}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: item.picture[0] }}
            />
            <View style={{ rowGap: 6 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Texts.Bold style={{ color: theme.colors.primary.green }}>
                    Produto
                  </Texts.Bold>
                  <Texts.Bold style={{ fontSize: 16 }}>{item.name}</Texts.Bold>
                </View>

                <View>
                  <Texts.Bold style={{ color: theme.colors.primary.green }}>
                    Quantidade
                  </Texts.Bold>
                  <Texts.Bold style={{ fontSize: 16 }}>
                    {item.quantity}{' '}
                    {item.unitMeasurement.name.toLowerCase() + '(s)'}
                  </Texts.Bold>
                </View>
              </View>

              <View>
                <Texts.Bold style={{ color: theme.colors.primary.green }}>
                  Código
                </Texts.Bold>
                <Texts.Bold style={{ fontSize: 16 }}>{item.barcode}</Texts.Bold>
              </View>

              <View>
                <Texts.Bold style={{ color: theme.colors.primary.green }}>
                  Endereço
                </Texts.Bold>
                <Texts.Bold style={{ fontSize: 16 }}>
                  {`${item.addresses[0].address.column} | ${item.addresses[0].address.level} ${item.addresses[0].address.deposit ? '| ' + item.addresses[0].address.deposit : ''}`}
                </Texts.Bold>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
              justifyContent: 'space-around',
            }}>
            {!item.validateAddress ? (
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: '/qr-code-camera',
                    params: {
                      path: '/(tabs)/(separation)/task',
                      addressId: item.addresses[0].address.id.toString(),
                      productId: item.id.toString(),
                    },
                  })
                }
                activeOpacity={theme.button.activeOpacity}
                style={styles.qrCodeButton}>
                <Texts.SemiBold
                  style={{
                    color: theme.colors.background.general,
                    fontSize: 18,
                  }}>
                  Ler endereço
                </Texts.SemiBold>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <CircleCheck color={theme.colors.primary.green} />
                <Texts.Bold
                  style={{ color: theme.colors.primary.green, fontSize: 18 }}>
                  Endereço
                </Texts.Bold>
              </View>
            )}

            {!item.validateProduct ? (
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: '/barcode-camera',
                    params: {
                      path: '/(tabs)/(separation)/task',
                      addressId: item.addresses[0].address.id.toString(),
                      productId: item.id.toString(),
                    },
                  })
                }
                activeOpacity={theme.button.activeOpacity}
                style={styles.qrCodeButton}>
                <Texts.SemiBold
                  style={{
                    color: theme.colors.background.general,
                    fontSize: 18,
                  }}>
                  Ler produto
                </Texts.SemiBold>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <CircleCheck color={theme.colors.primary.green} />
                <Texts.Bold
                  style={{ color: theme.colors.primary.green, fontSize: 18 }}>
                  Produto
                </Texts.Bold>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  column: {
    gap: 8,
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
  },
  item: {
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
  },
  row: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
  },
  qrCodeButton: {
    backgroundColor: theme.colors.primary.orange,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.button.borderRadius,
  },
})
