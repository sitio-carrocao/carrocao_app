import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useSeparation from '@contexts/separation'
import StockService from '@services/stock/StockService'
import { useMutation } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { CircleCheck, Printer } from 'lucide-react-native'
import { useCallback, useEffect, useMemo } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export default function TabSeparationTask() {
  const { data, setProduct, clear, onLoadCurrentTask, onLoadTasks } =
    useSeparation()

  const { productId, barcode, qrcode } = useLocalSearchParams<{
    qrcode?: string
    productId?: string
    barcode?: string
  }>()

  const allValidate = useMemo(() => {
    const allValidate = data?.products.filter(item => !item.validateProduct)
    if (allValidate?.length) {
      return false
    }
    return true
  }, [data])

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.waitingWithdrawRequestProduct,
    // onError: () => {
    //   toast.show({
    //     message: 'Não foi possível realizar a operação, tente novamente',
    //     title: 'ATENÇÃO',
    //     type: 'error',
    //   })
    // },
    onSuccess: async () => {
      clear()
      router.dismissTo({
        pathname: '/(tabs)/(separation)',
      })
      toast.show({
        message: 'Separação realizada com sucesso',
        title: 'Parabéns',
        type: 'success',
      })
      await onLoadCurrentTask()
      await onLoadTasks()
    },
  })

  const handlePrintStockrequest = useCallback(async () => {
    await StockService.printStockRequest({ id: data!.id })
  }, [data])

  const onSubmit = useCallback(
    async (addressId: string): Promise<void> => {
      await mutateAsync({
        id: data!.id,
        addressId: Number(addressId),
      })
    },
    [mutateAsync, data]
  )

  useEffect(() => {
    if (barcode && productId) {
      setProduct({ barcode, productId })
    }
  }, [productId, barcode, setProduct])

  useEffect(() => {
    if (qrcode) {
      onSubmit(qrcode)
    }
  }, [qrcode, onSubmit])

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.column}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View
            style={{
              rowGap: 8,
            }}>
            <Texts.Bold style={{ fontSize: 16 }}>
              Solicitante: {data?.admin.name}
            </Texts.Bold>
            <Texts.Bold style={{ fontSize: 16 }}>
              Data: {data ? format(parseISO(data.date), 'dd/MM/yyyy') : ''}
            </Texts.Bold>
          </View>

          <TouchableOpacity
            activeOpacity={theme.button.activeOpacity}
            style={{
              backgroundColor: theme.colors.primary.green,
              padding: 6,
              borderRadius: 6,
            }}
            onPress={handlePrintStockrequest}>
            <Printer
              color={theme.colors.background.general}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        </View>

        <Button
          label="Finalizar"
          disabled={!allValidate}
          isPending={isPending}
          // onHandle={onSubmit}
          onHandle={() =>
            router.navigate({
              pathname: '/qr-code-camera',
              params: {
                path: '/(tabs)/(separation)/task',
              },
            })
          }
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
                  Produto verificado
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
    flex: 1,
  },
})
