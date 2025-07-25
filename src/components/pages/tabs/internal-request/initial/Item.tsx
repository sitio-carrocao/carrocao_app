import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EInternalRequestStatus from '@enums/internalRequestStatus'
import type { InternalRequestList } from '@models/InternalRequest'
import { format, parseISO } from 'date-fns'
import { router } from 'expo-router'
import { Circle } from 'lucide-react-native'
import { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface IProps {
  item: InternalRequestList
}

export default function InternalRequestInitialItem({ item }: IProps) {
  const dataParsed = useMemo(() => {
    if (item?.status === EInternalRequestStatus.InSeparation) {
      return {
        color: theme.colors.secondary.yellow,
        status: 'Em separação',
      }
    }
    if (item?.status === EInternalRequestStatus.WaitingForSeparation) {
      return {
        color: theme.colors.secondary.blue,
        status: 'Aguardando separação',
      }
    }
    if (item?.status === EInternalRequestStatus.WaitingWithdraw) {
      return {
        color: theme.colors.secondary.wine,
        status: 'Aguardando retirada',
      }
    }
    if (item?.status === EInternalRequestStatus.Withdraw) {
      return { color: theme.colors.secondary.purple, status: 'Retirado' }
    }
  }, [item?.status])

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: '/(tabs)/(internal-request)/[id]',
          params: {
            id: item.id,
          },
        })
      }
      activeOpacity={theme.button.activeOpacity}>
      <View style={styles.container}>
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
