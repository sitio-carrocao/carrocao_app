import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardEvents } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface IRefProps {
  open(): void
  close(): void
}

interface IProps {
  onSelect(value: string): void
  data: { label: string; value: string }[]
  ref: Ref<IRefProps>
  error?: string
  value: string
  label: string
}

export default function Select({
  onSelect,
  data,
  ref,
  error,
  value,
  label,
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
    (value: string) => {
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
    return data.find(item => item.value.toString() === value)
  }, [value, data])

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.value.toLowerCase().includes(search.toLocaleLowerCase())
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.labelContainer}>
        <Texts.SemiBold
          style={{
            marginBottom: 4,
            color: theme.colors.primary.green,
          }}>
          {label}
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
          {currentValue ? currentValue.label : 'Selecione'}
        </Texts.SemiBold>
      </TouchableOpacity>

      <BottomSheetModal
        // handleStyle={{ backgroundColor: theme.colors.background.general }}
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
                Selecione uma opção
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
          keyExtractor={item => String(item.value)}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={theme.button.activeOpacity}
              onPress={() => handleSelect(item.value)}
              style={styles.item}>
              <Texts.Bold style={{ fontSize: 18 }}>{item.label}</Texts.Bold>
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
