import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import BottomSheet from '@gorhom/bottom-sheet'
import React, {
  type Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Texts from '@components/ui/Texts'

import Containers from '@components/ui/containers'
import Inputs from '@components/ui/inputs'
import theme from '@constants/themes'
import type StockAddress from '@models/StockAddress'

export interface IRefProps {
  open(): void
  close(): void
}

interface IProps {
  onSelect(value: StockAddress): void
  data: StockAddress[]
  ref: Ref<IRefProps>
}

export default function Addresses({ onSelect, data, ref }: IProps) {
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

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.description.toLowerCase().includes(search.toLocaleLowerCase())
    )
  }, [data, search])

  useImperativeHandle(ref, () => ({
    close: handleClose,
    open: handleOpen,
  }))

  return (
    <BottomSheetModal
      maxDynamicContentSize={500}
      bottomInset={insets.bottom}
      backdropComponent={renderBackdrop}
      onDismiss={() => setSearch('')}
      ref={bottomSheetModalRef}>
      <BottomSheetFlatList
        contentContainerStyle={styles.bottomSheetView}
        data={filteredData}
        ListHeaderComponent={
          <View style={styles.container}>
            <Texts.SemiBold
              style={{
                alignSelf: 'center',
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
            <Texts.SemiBold style={{ fontSize: 18, marginBottom: 4 }}>
              {item.description}
            </Texts.SemiBold>
            <Texts.Bold style={{ fontSize: 18 }}>
              {item.deposit} | {item.column}
              {' | '}
              {item.level} | {item.street}
            </Texts.Bold>
          </TouchableOpacity>
        )}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
  },
  field: {
    borderWidth: 1.5,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    paddingHorizontal: 4,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldText: {
    fontFamily: 'Raleway',
    fontWeight: 500,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  bottomSheetView: {
    paddingHorizontal: 16,
    flex: 1,
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
