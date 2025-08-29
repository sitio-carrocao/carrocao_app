import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type IProduct from '@models/Product'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface IProps {
  item: IProduct
  onSelectProduct: (product: IProduct) => void
}

export default function InternalRequestCreateItem({
  item,
  onSelectProduct,
}: IProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: item.picture[0] }} />
      <View style={styles.infoContainer}>
        <Texts.SemiBold style={{ fontSize: 16 }}>{item.name}</Texts.SemiBold>
        <Texts.SemiBold>
          Em estoque:{' '}
          {item.quantity > 0
            ? `${item.quantity} ${item.unitMeasurement.name} (s)`
            : 'Sem estoque'}
        </Texts.SemiBold>

        {item.quantity > 0 && (
          <TouchableOpacity
            onPress={() => onSelectProduct(item)}
            activeOpacity={theme.button.activeOpacity}
            style={styles.button}>
            <Texts.SemiBold style={{ color: theme.colors.background.general }}>
              Adicionar no carrinho
            </Texts.SemiBold>
          </TouchableOpacity>
          // )
          // : (
          //   <TouchableOpacity
          //     activeOpacity={theme.button.activeOpacity}
          //     style={[
          //       styles.button,
          //       { backgroundColor: theme.colors.primary.green },
          //     ]}>
          //     <Texts.SemiBold style={{ color: theme.colors.background.general }}>
          //       Solicitar compra
          //     </Texts.SemiBold>
          //   </TouchableOpacity>
        )}
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
    columnGap: 8,
    flexDirection: 'row',
  },
  infoContainer: {
    flexDirection: 'column',
    rowGap: 4,
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.button.borderRadius,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  image: {
    width: 70,
    height: 70,
  },
})
