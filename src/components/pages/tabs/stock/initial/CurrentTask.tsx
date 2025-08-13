import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type IGetValidatedProductDetailsOutputData from '@services/stock/dtos/getValidatedProductDetails/OutputData'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  data?: IGetValidatedProductDetailsOutputData
}

export default function StockInitialCurrentTask({ data }: IProps) {
  const handleFinishTask = useCallback(() => {
    if (data?.alreadyRegistered) {
      router.navigate({
        pathname: `/(tabs)/(stock)/address`,
      })
    } else {
      router.navigate({ pathname: `/(tabs)/(stock)/product` })
    }
  }, [data])

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
            Descrição
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>{data?.description}</Texts.Bold>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.flex}>
            <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
              Quantidade
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>
              {data?.quantity} {data?.unitMeasurement}
            </Texts.Bold>
          </View>

          <View style={styles.flex}>
            <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
              Código de barra
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>{data?.barcode}</Texts.Bold>
          </View>
        </View>

        {data?.suggestedAddress && (
          <View>
            <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
              Endereço sugerido
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>
              {data?.suggestedAddress
                ? `${data.suggestedAddress.column} | ${data.suggestedAddress.level} ${data.suggestedAddress.deposit ? '| ' + data.suggestedAddress.deposit : ''}`
                : 'Não informado'}
            </Texts.Bold>
          </View>
        )}

        <Button label="Iniciar" onHandle={handleFinishTask} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 16,
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
