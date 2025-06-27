import Texts from '@components/ui/Texts'
import Containers from '@components/ui/containers'
import theme from '@constants/themes'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import StockService from '@services/stock/StockService'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Circle } from 'lucide-react-native'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'

const history = [
  {
    id: 1,
    date: '01/04/2025',
    status: 'Solicitação criada',
  },
  {
    id: 2,
    date: '02/04/2025',
    status: 'Solicitação entrou na fila de separação',
  },
  {
    id: 3,
    date: '03/04/2025',
    status: 'Solicitação liberada para retirar',
  },
  {
    id: 4,
    date: '03/04/2025',
    status: 'Solicitação retirada',
  },
]

export default function TabInternalRequestDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data, isPending, refetch, isRefetching } = useQuery({
    queryFn: async () => {
      const response = await StockService.getInternalRequestDetails({
        id: Number(id),
      })
      return response
    },
    queryKey: ['internalRequestDetails', id],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const dataParsed = useMemo(() => {
    if (data?.status === EInternalRequestStatus.InSeparation) {
      return {
        color: theme.colors.secondary.yellow,
        status: 'Em separação',
      }
    }
    if (data?.status === EInternalRequestStatus.WaitingForSeparation) {
      return {
        color: theme.colors.secondary.blue,
        status: 'Aguardando separação',
      }
    }
    if (data?.status === EInternalRequestStatus.WaitingWithdraw) {
      return {
        color: theme.colors.secondary.wine,
        status: 'Aguardando retirada',
      }
    }
    if (data?.status === EInternalRequestStatus.Withdraw) {
      return { color: theme.colors.secondary.purple, status: 'Retirado' }
    }
  }, [data?.status])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Solicitação interna #${id}`,
        }}
      />
      {isPending ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={theme.colors.primary.green} size={80} />
          <Texts.Bold style={{ fontSize: 18, marginTop: 24 }}>
            Carregando...
          </Texts.Bold>
        </View>
      ) : (
        <Containers.Scroll
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }>
          <View style={styles.resumeContainer}>
            <Texts.SemiBold>Data da solicitação</Texts.SemiBold>
            <Texts.SemiBold style={{ fontSize: 18, marginBottom: 8 }}>
              {data?.date
                ? format(parseISO(data?.date), 'dd/MM/yyyy HH:mm:ss')
                : 'Não informado'}
            </Texts.SemiBold>

            <Texts.SemiBold>Status</Texts.SemiBold>
            <View style={styles.statusContainer}>
              <Circle color={dataParsed?.color} fill={dataParsed?.color} />
              <Texts.SemiBold style={{ fontSize: 18 }}>
                {dataParsed?.status}
              </Texts.SemiBold>
            </View>
          </View>

          <Texts.Bold
            style={{
              color: theme.colors.primary.green,
              fontSize: 24,
              marginBottom: 8,
              marginTop: 16,
            }}>
            Produtos
          </Texts.Bold>

          <View style={styles.productMainContainer}>
            {data?.products.map(item => (
              <View style={styles.productContainer} key={item.id}>
                <Image
                  style={styles.productImage}
                  source={{ uri: item.picture[0] }}
                />
                <View>
                  <Texts.SemiBold style={{ fontSize: 20 }}>
                    {item.name}
                  </Texts.SemiBold>
                  <Texts.SemiBold style={{ fontSize: 16 }}>
                    Quantidade:{' '}
                    <Texts.SemiBold style={{ fontSize: 18 }}>
                      {item.quantity} {item.unitMeasurement.name.toLowerCase()}
                      (s)
                    </Texts.SemiBold>
                  </Texts.SemiBold>
                </View>
              </View>
            ))}
          </View>

          <Texts.Bold
            style={{
              color: theme.colors.primary.green,
              fontSize: 24,
              marginBottom: 8,
              marginTop: 16,
            }}>
            Histórico
          </Texts.Bold>

          <View style={styles.historyMainContainer}>
            <View style={styles.line} />
            {history.map(item => (
              <View key={item.id} style={styles.historyContainer}>
                <Circle
                  size={23}
                  color={theme.colors.primary.orange}
                  fill={theme.colors.primary.orange}
                />
                <Texts.SemiBold style={{ fontSize: 16, flexShrink: 1 }}>
                  {item.date} - {item.status}
                </Texts.SemiBold>
              </View>
            ))}
          </View>
        </Containers.Scroll>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
  resumeContainer: {
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
  },
  statusContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
  productMainContainer: {
    rowGap: 12,
  },
  productContainer: {
    borderWidth: 1.5,
    padding: 8,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
    columnGap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
  },
  historyMainContainer: {
    position: 'relative',
    rowGap: 16,
  },
  historyContainer: {
    flexDirection: 'row',
    columnGap: 4,
  },
  line: {
    height: '90%',
    width: 2.5,
    backgroundColor: theme.colors.primary.orange,
    position: 'absolute',
    left: 10,
    top: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
