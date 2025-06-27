import Texts from '@components/ui/Texts'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { ImageUpscale, Trash2 } from 'lucide-react-native'
import React, {
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import theme from '@constants/themes'

export interface IPropsRef {
  open(index: number): void
  close(): void
}

interface IProps {
  removeImage(index: number): void
  viewImage(index: number): void
  ref: Ref<IPropsRef>
}

export default function OptionsImage({ removeImage, viewImage, ref }: IProps) {
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
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

  useImperativeHandle(
    ref,
    () => ({
      open(index: number) {
        bottomSheetModalRef.current?.present()
        setCurrentIndex(index)
      },
      close() {
        bottomSheetModalRef.current?.dismiss()
      },
    }),
    []
  )

  return (
    <>
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
            Selecione uma opção
          </Texts.SemiBold>
          <View>
            <TouchableOpacity
              onPress={() => viewImage(currentIndex)}
              style={styles.item}>
              <ImageUpscale color={theme.colors.primary.orange} />
              <Texts.SemiBold style={{ fontSize: 18 }}>
                Ver imagem
              </Texts.SemiBold>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => removeImage(currentIndex)}
              style={styles.item}>
              <Trash2 color={theme.colors.primary.orange} />
              <Texts.SemiBold style={{ fontSize: 18 }}>
                Excluir imagem
              </Texts.SemiBold>
            </TouchableOpacity>
          </View>
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
