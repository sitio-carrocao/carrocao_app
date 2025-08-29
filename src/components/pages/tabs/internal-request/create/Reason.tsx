import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import useInternalRequestCart from '@contexts/internalRequestCart'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import type IProduct from '@models/Product'
import StockService from '@services/stock/StockService'
import { Circle } from 'lucide-react-native'
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface IPropsRef {
  open(product: IProduct): void
  close(): void
}

interface IProps {
  ref: Ref<IPropsRef>
}

export default function Reason({ ref }: IProps) {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [data, setData] = useState<{ id: number; description: string }[]>([])

  const { addProduct } = useInternalRequestCart()

  const [search, setSearch] = useState<string>('')

  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handleSelect = useCallback(
    (reason: { id: number; description: string }) => {
      bottomSheetModalRef.current?.dismiss()
      addProduct({ ...product!, reason })
    },
    [product, addProduct]
  )

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.8}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough
        pressBehavior={'close'}
      />
    ),
    []
  )

  const handleLoadingCostCenters = useCallback(async () => {
    const response = await StockService.costCenters()
    setData(response.list)
  }, [])

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.description.toLowerCase().includes(search.toLocaleLowerCase())
    )
  }, [search, data])

  useImperativeHandle(
    ref,
    () => ({
      open(currentProduct: IProduct) {
        setProduct(currentProduct)
        bottomSheetModalRef.current?.present()
      },
      close() {
        bottomSheetModalRef.current?.dismiss()
      },
    }),
    []
  )

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      // setKeyboardStatus('Keyboard Shown')
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetModalRef.current?.collapse()
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  useEffect(() => {
    handleLoadingCostCenters()
  }, [handleLoadingCostCenters])

  return (
    <BottomSheetModal
      onDismiss={() => setSearch('')}
      bottomInset={insets.bottom}
      backdropComponent={renderBackdrop}
      ref={bottomSheetModalRef}>
      <BottomSheetFlatList
        contentContainerStyle={styles.bottomSheetView}
        data={filteredData}
        stickyHeaderIndices={[0]}
        ListHeaderComponentStyle={styles.headerContainer}
        ListHeaderComponent={
          <View style={styles.container}>
            <Texts.SemiBold
              style={{
                fontSize: 18,
                color: theme.colors.primary.green,
              }}>
              Onde será utilizado?
            </Texts.SemiBold>
            <Inputs.BottomSheet
              inputProps={{
                returnKeyType: 'search',
                submitBehavior: 'submit',
                onChangeText: setSearch,
                value: search,
                placeholder: 'Pesquisar',
                placeholderTextColor: '#0000004D',
              }}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={theme.button.activeOpacity}
            onPress={() => handleSelect(item)}
            style={styles.item}>
            <Texts.Bold style={{ fontSize: 18 }}>{item.description}</Texts.Bold>
            <Circle color="#00000080" />
          </TouchableOpacity>
        )}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
    marginBottom: 8,
  },
  headerContainer: {
    backgroundColor: theme.colors.background.general,
  },
  labelContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    borderWidth: 1.5,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    paddingHorizontal: 16,
    height: 43,
    justifyContent: 'center',
  },
  bottomSheetView: {
    paddingHorizontal: 16,
    flexGrow: 1,
    backgroundColor: theme.input.backgroundColor.primary,
    paddingVertical: 16,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    columnGap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: `${theme.input.borderColor}4D`,
    marginVertical: 4,
  },
})
