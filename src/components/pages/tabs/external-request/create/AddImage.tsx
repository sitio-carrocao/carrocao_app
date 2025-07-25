import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Camera, Images } from 'lucide-react-native'
import React, {
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface IPropsRef {
  open(): void
  close(): void
}

interface IProps {
  openCamera(): Promise<void>
  openGallery(): Promise<void>
  ref: Ref<IPropsRef>
}

export default function AddImage({ openCamera, openGallery, ref }: IProps) {
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

  const handleOpenCamera = useCallback(async () => {
    bottomSheetModalRef.current?.dismiss()
    await openCamera()
  }, [openCamera])

  const handleOpenGallery = useCallback(async () => {
    bottomSheetModalRef.current?.dismiss()
    await openGallery()
  }, [openGallery])

  useImperativeHandle(
    ref,
    () => ({
      open() {
        bottomSheetModalRef.current?.present()
      },
      close() {
        bottomSheetModalRef.current?.dismiss()
      },
    }),
    []
  )

  return (
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
          <TouchableOpacity onPress={handleOpenCamera} style={styles.item}>
            <Camera color={theme.colors.primary.orange} />
            <Texts.SemiBold style={{ fontSize: 18 }}>
              Abrir camera
            </Texts.SemiBold>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={handleOpenGallery} style={styles.item}>
            <Images color={theme.colors.primary.orange} />
            <Texts.SemiBold style={{ fontSize: 18 }}>
              Abrir galeria
            </Texts.SemiBold>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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
