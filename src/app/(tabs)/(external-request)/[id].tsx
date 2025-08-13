import Containers from '@components/ui/containers'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EExternalRequestStatus from '@enums/externalRequestStatus'
import StockService from '@services/stock/StockService'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Circle, ImageIcon } from 'lucide-react-native'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
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
    status: 'Solicitação entrou na fila de aprovação',
  },
  {
    id: 3,
    date: '03/04/2025',
    status: 'Solicitação entrou na fila de compras',
  },
  {
    id: 4,
    date: '03/04/2025',
    status: 'Setor de compras efetuou a compra do produto',
  },
  {
    id: 5,
    date: '03/04/2025',
    status: 'Produto disponível para reirada',
  },
  {
    id: 6,
    date: '03/04/2025',
    status: 'Produto retirado',
  },
]

export default function TabExternalRequestDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data, isPending, refetch, isRefetching } = useQuery({
    queryFn: async () => {
      const response = await StockService.getExternalRequestDetails({
        id: Number(id),
      })
      return response
    },
    queryKey: ['externalRequestDetails', id],
    refetchOnWindowFocus: false,
  })

  const dataParsed = useMemo(() => {
    if (data?.solicitation.status === EExternalRequestStatus.FinishLater) {
      return {
        color: theme.colors.secondary.blue,
        status: 'Adiado',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.Finished) {
      return {
        color: theme.colors.secondary.pink,
        status: 'Finalizado',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.Pending) {
      return {
        color: theme.colors.secondary.yellow,
        status: 'Pendente',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.InQuotation) {
      return {
        color: theme.colors.secondary.orange,
        status: 'Em cotação',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.AwaitingApproval) {
      return {
        color: theme.colors.secondary.purple,
        status: 'Aguardando aprovação',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.AwaitingPurchase) {
      return {
        color: theme.colors.secondary.wine,
        status: 'Aguardando compra',
      }
    }
    if (data?.solicitation.status === EExternalRequestStatus.AwaitingDelivery) {
      return {
        color: theme.colors.primary.green,
        status: 'Aguardando entrega',
      }
    }
  }, [data?.solicitation.status])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Solicitação externa #${id}`,
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
              {data?.solicitation.date
                ? format(
                    parseISO(data.solicitation.date),
                    'dd/MM/yyyy HH:mm:ss'
                  )
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

          <View style={styles.productMainContainer}>
            {/* <Image
                  style={styles.productImage}
                  source={{ uri: item.picture[0] }}
                /> */}
            <View>
              <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                Produto
              </Texts.SemiBold>
              <Texts.SemiBold style={{ fontSize: 20 }}>
                {data?.solicitation.product}
              </Texts.SemiBold>
            </View>

            <View style={styles.row}>
              <View>
                <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                  Quantidade
                </Texts.SemiBold>
                <Texts.SemiBold style={{ fontSize: 18 }}>
                  {data?.solicitation.quantity}
                </Texts.SemiBold>
              </View>

              <View>
                <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                  Marca
                </Texts.SemiBold>
                <Texts.SemiBold style={{ fontSize: 18 }}>
                  {data?.solicitation.brand || 'Não informado'}
                </Texts.SemiBold>
              </View>
            </View>

            <View style={styles.row}>
              <View>
                <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                  Cor
                </Texts.SemiBold>
                <Texts.SemiBold style={{ fontSize: 18 }}>
                  {data?.solicitation.color || 'Não informado'}
                </Texts.SemiBold>
              </View>

              <View>
                <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                  Modelo
                </Texts.SemiBold>
                <Texts.SemiBold style={{ fontSize: 18 }}>
                  {data?.solicitation.model || 'Não informado'}
                </Texts.SemiBold>
              </View>
            </View>

            <View>
              <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                Detalhes
              </Texts.SemiBold>
              <Texts.SemiBold style={{ fontSize: 18 }}>
                {data?.solicitation.details || 'Não informado'}
              </Texts.SemiBold>
            </View>

            <View>
              <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
                Onde será utilizado
              </Texts.SemiBold>
              <Texts.SemiBold style={{ fontSize: 18 }}>
                {data?.solicitation.whereUsed || 'Não informado'}
              </Texts.SemiBold>
            </View>
          </View>

          <View style={styles.productImageMainContainer}>
            {data?.solicitation.pictures.map(item => (
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: '/(tabs)/(external-request)/image',
                    params: {
                      uri: item,
                    },
                  })
                }
                activeOpacity={theme.button.activeOpacity}
                key={item}>
                <View style={styles.imageContainer}>
                  <Image style={styles.productImage} source={{ uri: item }} />
                </View>
                <View style={styles.imageIconContainer}>
                  <ImageIcon
                    strokeWidth={1.5}
                    color={theme.colors.background.general}
                  />
                </View>
              </TouchableOpacity>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    columnGap: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
  productMainContainer: {
    rowGap: 12,
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
  },
  productImageMainContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  imageContainer: {
    borderColor: theme.colors.primary.green,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    overflow: 'hidden',
    width: Math.floor((Dimensions.get('screen').width - 64) / 3),
    height: Math.floor((Dimensions.get('screen').width - 64) / 3),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageIconContainer: {
    backgroundColor: theme.colors.primary.green,
    alignItems: 'center',
    paddingVertical: 4,
    borderEndEndRadius: 8,
    borderStartEndRadius: 8,
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
