import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EExternalRequestStatus from '@enums/externalRequestStatus'
import { type ExternalRequestList } from '@models/ExternalRequest'
import { format, parseISO } from 'date-fns'
import { router } from 'expo-router'
import { Circle } from 'lucide-react-native'
import { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface IProps {
  item: ExternalRequestList
}

export default function ExternalRequestInitialItem({ item }: IProps) {
  const dataParsed = useMemo(() => {
    if (item?.status === EExternalRequestStatus.FinishLater) {
      return {
        color: theme.colors.secondary.blue,
        status: 'Adiado',
      }
    }
    if (item?.status === EExternalRequestStatus.Finished) {
      return {
        color: theme.colors.secondary.pink,
        status: 'Finalizado',
      }
    }
    if (item?.status === EExternalRequestStatus.Pending) {
      return {
        color: theme.colors.secondary.yellow,
        status: 'Pendente',
      }
    }
    if (item?.status === EExternalRequestStatus.InQuotation) {
      return {
        color: theme.colors.secondary.orange,
        status: 'Em cotação',
      }
    }
    if (item?.status === EExternalRequestStatus.AwaitingApproval) {
      return {
        color: theme.colors.secondary.purple,
        status: 'Aguardando aprovação',
      }
    }
    if (item?.status === EExternalRequestStatus.AwaitingPurchase) {
      return {
        color: theme.colors.secondary.wine,
        status: 'Aguardando compra',
      }
    }
    if (item?.status === EExternalRequestStatus.AwaitingDelivery) {
      return {
        color: theme.colors.primary.green,
        status: 'Aguardando entrega',
      }
    }
  }, [item?.status])

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: '/(tabs)/(external-request)/[id]',
          params: {
            id: item.id,
          },
        })
      }
      activeOpacity={theme.button.activeOpacity}>
      <View style={styles.container}>
        <Texts.SemiBold style={{ fontSize: 16 }}>
          Produto: {item.name}
        </Texts.SemiBold>
        <Texts.SemiBold style={{ fontSize: 16 }}>
          Data da solicitação: {format(parseISO(item.date), 'dd/MM/yyyy')}
        </Texts.SemiBold>
        <View style={styles.statusContainer}>
          <Texts.SemiBold style={{ fontSize: 16 }}>Status:</Texts.SemiBold>
          <Circle color={dataParsed?.color} fill={dataParsed?.color} />
          <Texts.SemiBold style={{ fontSize: 16 }}>
            {dataParsed?.status}
          </Texts.SemiBold>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
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
})
