import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type { InternalRequestList } from '@models/InternalRequest'
import { format, parseISO } from 'date-fns'
import { StyleSheet, View } from 'react-native'

interface IProps {
  item: InternalRequestList
}

export default function SeparationInitialItem({ item }: IProps) {
  return (
    <View style={styles.container}>
      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Solicitante
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>{item.admin.name}</Texts.Bold>
      </View>

      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Data
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {format(parseISO(item.date), 'dd/MM/yyyy - HH:mm:ss')}
        </Texts.Bold>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
    rowGap: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
})
