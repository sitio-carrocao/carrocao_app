import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type IStockRequestTaskOutputData from '@services/stock/dtos/stockRequestTask/OutputData'
import { format, parseISO } from 'date-fns'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  data?: IStockRequestTaskOutputData | null
}
export default function SeparationInitialCurrentTask({ data }: IProps) {
  const handleFinishTask = useCallback(() => {
    router.navigate({ pathname: `/(tabs)/(separation)/task` })
  }, [])

  if (!data) {
    return null
  }

  return (
    <View style={styles.mainContainer}>
      <Texts.Bold
        style={{
          fontSize: 24,
          color: theme.colors.primary.green,
          marginBottom: 16,
        }}>
        Minha tarefa
      </Texts.Bold>
      <View style={styles.container}>
        <View>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Solicitante
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>{data.admin.name}</Texts.Bold>
        </View>

        <View>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Data
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>
            {format(parseISO(data.date), 'dd/MM/yyyy - HH:mm:ss')}
          </Texts.Bold>
        </View>

        <Button label="Iniciar" onHandle={handleFinishTask} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 32,
  },
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
  rowContainer: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
})
