import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useInternalRequestCart from '@contexts/internalRequestCart'
import { type IInternalRequestCart } from '@models/Product'
import { CircleMinus, CirclePlus, Trash2 } from 'lucide-react-native'
import { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface IProps {
  item: IInternalRequestCart
}

export default function InternalRequestCartItem({ item }: IProps) {
  const { removeProduct, updateQuantity } = useInternalRequestCart()
  const [quantity, setQuantity] = useState<string>(
    String(item.quantitySelected)
  )

  const handleSetQuantity = (value: string) => {
    setQuantity(value)
    updateQuantity(item.id, Number(value))
  }

  const handleOnBlur = () => {
    setQuantity(oldState => {
      if (!oldState || oldState === '0') {
        return item.quantitySelected.toString()
      }
      if (Number(oldState) > item.quantity) {
        toast.show({
          message: 'Quantidade selecionada indisponível',
          title: 'Atenção',
          type: 'error',
        })
        return item.quantitySelected.toString()
      }
      updateQuantity(item.id, Number(oldState))
      return oldState
    })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: item.picture[0] }} />
      <View style={styles.infoContainer}>
        <Texts.SemiBold style={{ fontSize: 16 }}>{item.name}</Texts.SemiBold>
        <Texts.SemiBold>
          {`Em estoque: ${item.quantity} ${item.unitMeasurement.name}(s)`}
        </Texts.SemiBold>

        <Texts.Regular>{item.reason.description}</Texts.Regular>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={Number(quantity) === 1}
            onPress={() => handleSetQuantity(String(Number(quantity) - 1))}
            activeOpacity={theme.button.activeOpacity}
            style={[
              styles.button,
              Number(quantity) === 1 && styles.buttonDisabled,
            ]}>
            <CircleMinus color={theme.colors.primary.orange} size={30} />
          </TouchableOpacity>
          <Inputs.Root
            fieldStyle={{ width: 70 }}
            inputStyle={{ textAlign: 'center' }}
            inputProps={{
              value: quantity,
              onChangeText: setQuantity,
              keyboardType: 'numeric',
              autoCapitalize: 'none',
              autoComplete: 'off',
              autoCorrect: false,
              onBlur: handleOnBlur,
            }}
          />
          <TouchableOpacity
            disabled={Number(quantity) === item.quantity}
            onPress={() => handleSetQuantity(String(Number(quantity) + 1))}
            activeOpacity={theme.button.activeOpacity}
            style={[
              styles.button,
              Number(quantity) === item.quantity && styles.buttonDisabled,
            ]}>
            <CirclePlus color={theme.colors.primary.orange} size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => removeProduct(item.id)}
            activeOpacity={theme.button.activeOpacity}
            style={[styles.button, { marginLeft: 'auto' }]}>
            <Trash2 color={theme.colors.utils.danger} />
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  image: {
    width: 70,
    height: 70,
  },
})
