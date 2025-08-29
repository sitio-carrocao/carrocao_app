import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import type StockAddress from '@models/StockAddress'
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardEvents } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface IRefProps {
  open(): void
  close(): void
}

interface IProps {
  onSelect(value: StockAddress): void
  data: StockAddress[]
  ref: Ref<IRefProps>
  error?: string
  value: string
}

export default function Addresses({
  onSelect,
  data,
  ref,
  error,
  value,
}: IProps) {
  const [search, setSearch] = useState<string>('')
  const insets = useSafeAreaInsets()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

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

  const handleSelect = useCallback(
    (value: StockAddress) => {
      onSelect(value)
      bottomSheetModalRef.current?.dismiss()
    },
    [onSelect]
  )

  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss()
  }, [])

  const currentValue = useMemo(() => {
    return data.find(item => item.id.toString() === value)
  }, [value, data])

  const filteredData = useMemo(() => {
    return data.filter(item =>
      `${item.column} | ${item.level} ${item.deposit ? '| ' + item.deposit : ''}`
        .toLowerCase()
        .includes(search.toLocaleLowerCase())
    )
  }, [data, search])

  useImperativeHandle(ref, () => ({
    close: handleClose,
    open: handleOpen,
  }))

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillHide', () => {
      bottomSheetModalRef.current?.collapse()
    })

    return () => {
      show.remove()
    }
  }, [])

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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.labelContainer}>
        <Texts.SemiBold
          style={{
            marginBottom: 4,
            color: theme.colors.primary.green,
          }}>
          Endereço
        </Texts.SemiBold>
        {error && (
          <Texts.SemiBold
            style={{
              color: theme.colors.utils.danger,
            }}>
            {error}
          </Texts.SemiBold>
        )}
      </View>
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={theme.button.activeOpacity}
        style={[
          styles.options,
          error && { borderColor: theme.colors.utils.danger },
        ]}>
        <Texts.SemiBold style={[!value && { color: '#888888' }]}>
          {currentValue
            ? `${currentValue.column} | ${currentValue.level} ${currentValue.deposit ? '| ' + currentValue.deposit : ''}`
            : 'Selecione'}
        </Texts.SemiBold>
      </TouchableOpacity>

      <BottomSheetModal
        maxDynamicContentSize={Dimensions.get('screen').height / 2}
        bottomInset={insets.bottom}
        backdropComponent={renderBackdrop}
        onDismiss={() => setSearch('')}
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
                Selecione um endereço
              </Texts.SemiBold>
              <Inputs.BottomSheet
                inputProps={{
                  returnKeyType: 'search',
                  submitBehavior: 'submit',
                  onChangeText: setSearch,
                  value: search,
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
              <Texts.Bold style={{ fontSize: 18 }}>
                {`${item.column} | ${item.level} ${item.deposit ? '| ' + item.deposit : ''}`}
              </Texts.Bold>
            </TouchableOpacity>
          )}
        />
      </BottomSheetModal>
    </View>
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
  },
  separator: {
    height: 1,
    backgroundColor: `${theme.input.borderColor}4D`,
    marginVertical: 4,
  },
})
