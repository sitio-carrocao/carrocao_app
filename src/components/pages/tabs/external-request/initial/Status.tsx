import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Circle } from 'lucide-react-native'
import React, { useCallback, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Texts from '@components/ui/Texts'

import theme from '@constants/themes'
import EExternalRequestStatus from '@enums/externalRequestStatus'

const list = [
  { label: 'Todos', color: '', value: '' },
  {
    label: 'Adiado',
    color: theme.colors.secondary.blue,
    value: EExternalRequestStatus.FinishLater,
  },
  {
    label: 'Finalizado',
    color: theme.colors.utils.success,
    value: EExternalRequestStatus.Finished,
  },
  {
    label: 'Pendente',
    color: theme.colors.secondary.orange,
    value: EExternalRequestStatus.Pending,
  },
  {
    label: 'Em cotação',
    color: theme.colors.secondary.yellow,
    value: EExternalRequestStatus.InQuotation,
  },
  {
    label: 'Aguar. aprovação',
    color: theme.colors.secondary.purple,
    value: EExternalRequestStatus.AwaitingApproval,
  },
  {
    label: 'Aguar. compra',
    color: theme.colors.secondary.pink,
    value: EExternalRequestStatus.AwaitingPurchase,
  },
  {
    label: 'Aguar. entrega',
    color: theme.colors.secondary.wine,
    value: EExternalRequestStatus.AwaitingDelivery,
  },
]

interface IProps {
  onSelect(value: EExternalRequestStatus): void
  value: string
}

export default function Status({ onSelect, value }: IProps) {
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
    (value: EExternalRequestStatus) => {
      onSelect(value)
      bottomSheetModalRef.current?.dismiss()
    },
    [onSelect]
  )

  return (
    <>
      <TouchableOpacity
        activeOpacity={theme.button.activeOpacity}
        onPress={() => bottomSheetModalRef.current?.present()}
        style={styles.field}>
        <Texts.SemiBold>
          {list.find(item => item.value === value)?.label || 'Todos'}
        </Texts.SemiBold>
      </TouchableOpacity>

      <BottomSheetModal
        bottomInset={insets.bottom}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}>
        <BottomSheetView style={styles.bottomSheetView}>
          <Texts.SemiBold
            style={{
              alignSelf: 'center',
              fontSize: 18,
              marginBottom: 8,
              color: theme.colors.primary.green,
            }}>
            Selecione um status
          </Texts.SemiBold>
          {list.map((item, index) => (
            <View key={item.value}>
              <TouchableOpacity
                onPress={() =>
                  handleSelect(item.value as EExternalRequestStatus)
                }
                style={styles.item}>
                <Circle color={item.color} fill={item.color} />
                <Texts.SemiBold style={{ fontSize: 18 }}>
                  {item.label}
                </Texts.SemiBold>
              </TouchableOpacity>
              {index !== list.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
    backgroundColor: theme.input.backgroundColor.primary,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  separator: {
    height: 1,
    backgroundColor: `${theme.input.borderColor}4D`,
    marginVertical: 4,
  },
})
