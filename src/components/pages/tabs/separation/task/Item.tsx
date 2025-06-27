import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import EInternalRequestProductsStatus from '@enums/internalRequestProductsStatus'
import type ISolicitationProduct from '@models/SolicitationProduct'
import { CheckCircle, ScanBarcode } from 'lucide-react-native'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface IProps {
  item: ISolicitationProduct
  index: number
  openCamera(index: number): void
}

export default function SeparationTaskItem({
  item,
  openCamera,
  index,
}: IProps) {
  const bestAddress = item.addresses.find(item => item.isBestOption)
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image style={styles.image} source={{ uri: item.picture[0] }} />
        <View style={styles.infoContainer}>
          <View>
            <Texts.SemiBold
              style={{
                color: theme.colors.primary.green,
              }}>
              Produto
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>{item.name}</Texts.Bold>
          </View>

          <View>
            <Texts.SemiBold
              style={{
                color: theme.colors.primary.green,
              }}>
              Quantidade
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>
              {item.quantity} {item.unitMeasurement.name}
            </Texts.Bold>
          </View>
        </View>
      </View>

      <View>
        <Texts.SemiBold
          style={{
            color: theme.colors.primary.green,
          }}>
          Endereço
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {item.addresses.find(item => item.isBestOption)?.address.description}
        </Texts.Bold>
        <Texts.Bold style={{ fontSize: 18, marginBottom: 4 }}>
          {bestAddress?.address.deposit} | {bestAddress?.address.column}
          {' | '}
          {bestAddress?.address.level} | {bestAddress?.address.street}
        </Texts.Bold>
      </View>

      <View>
        <Texts.SemiBold
          style={{
            color: theme.colors.primary.green,
          }}>
          Código de barras
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18, marginBottom: 12 }}>
          {item.barcode}
        </Texts.Bold>
      </View>

      {item.status === EInternalRequestProductsStatus.Waiting ? (
        <TouchableOpacity
          onPress={() => openCamera(index)}
          activeOpacity={theme.button.activeOpacity}
          style={styles.button}>
          <ScanBarcode color={theme.colors.background.general} size={22} />
          <Texts.Bold style={{ color: theme.colors.background.general }}>
            Ler Cod. de barras
          </Texts.Bold>
        </TouchableOpacity>
      ) : (
        <View style={styles.completeContainer}>
          <CheckCircle
            color={theme.colors.utils.success}
            strokeWidth={2.5}
            size={26}
          />
          <Texts.SemiBold
            style={{ fontSize: 18, color: theme.colors.utils.success }}>
            Produto registrado
          </Texts.SemiBold>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    borderColor: theme.colors.primary.green,
    columnGap: 8,
    // flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    columnGap: 12,
  },
  infoContainer: {
    flexDirection: 'column',
    rowGap: 4,
    flex: 1,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  completeContainer: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary.orange,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    flexDirection: 'row',
    gap: 4,
  },
})
