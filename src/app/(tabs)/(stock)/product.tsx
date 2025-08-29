import AddImage, {
  type IPropsRef as AddImageRef,
} from '@components/pages/tabs/stock/product/AddImage'
import Addresses, {
  type IRefProps as AddressRef,
} from '@components/pages/tabs/stock/product/Addresses'
import OptionsImage, {
  type IPropsRef as OptionsImageRef,
} from '@components/pages/tabs/stock/product/OptionsImage'
import Select, {
  type IRefProps as SelectRefProps,
} from '@components/pages/tabs/stock/product/Select'
import Button from '@components/ui/Button'
import Inputs, { type RootRefProps } from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useStock from '@contexts/stock'
import { zodResolver } from '@hookform/resolvers/zod'
import ProductService from '@services/product/ProductService'
import { useMutation } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { Ellipsis, ImagePlus } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  suggestedAddress: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  barcode: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  model: z.string(),
  observation: z.string(),
  min: z.string().min(1, {
    message: '*',
  }),
  max: z.string().min(1, {
    message: '*',
  }),
  productType: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  stockType: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  unitMensuare: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
})

export default function TabStockProduc() {
  const {
    onLoadCurrentTask,
    onLoadTasks,
    currentTask,
    productTypes,
    stockTypes,
    unitMeasurements,
    addresses,
  } = useStock()
  const addressRef = useRef<AddressRef>(null)
  const barcodeRef = useRef<RootRefProps>(null)
  const modelRef = useRef<RootRefProps>(null)
  const minRef = useRef<RootRefProps>(null)
  const maxRef = useRef<RootRefProps>(null)
  const productTypeRef = useRef<SelectRefProps>(null)
  const addImageRef = useRef<AddImageRef>(null)
  const optionsImageRef = useRef<OptionsImageRef>(null)

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])

  const [status, requestPermission] = ImagePicker.useCameraPermissions()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: currentTask?.description || '',
      barcode: currentTask?.barcode || '',
      max: '',
      min: '',
      model: '',
      productType: '',
      stockType: '',
      unitMensuare:
        unitMeasurements
          .find(
            item =>
              item.name.toLowerCase() ===
              currentTask?.unitMeasurement.toLowerCase()
          )
          ?.id.toString() || '',
      observation: '',
    },
  })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: ProductService.create,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a operação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: async () => {
      router.dismissTo({
        pathname: '/(tabs)/(stock)',
      })
      toast.show({
        message: 'Produto registrado com sucesso',
        title: 'Parabéns',
        type: 'success',
      })
      await onLoadCurrentTask()
      await onLoadTasks()
    },
  })

  const openGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.4,
    })
    if (!result.canceled) {
      setImages(oldState => {
        return oldState.concat(result.assets[0])
      })
    }
  }, [])

  const openCamera = useCallback(async () => {
    if (!status?.granted) {
      toast.show({
        message:
          'É necessário permitir a utilização da câmera nas configurações do aplciativo',
        title: 'ATENÇÃO',
        type: 'error',
      })
      await requestPermission()
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      cameraType: ImagePicker.CameraType.back,
      quality: 0.4,
    })
    if (!result.canceled) {
      setImages(oldState => {
        return oldState.concat(result.assets[0])
      })
    }
  }, [requestPermission, status])

  const removeImage = useCallback((index: number) => {
    setImages(oldState => {
      return oldState.filter((_, currentIndex) => currentIndex !== index)
    })
  }, [])

  const viewImage = useCallback(
    (index: number) => {
      optionsImageRef.current?.close()
      router.navigate({
        pathname: '/(tabs)/(stock)/image',
        params: {
          uri: images[index].uri,
        },
      })
    },
    [images]
  )

  const handleFocusBarcodeInput = useCallback(() => {
    barcodeRef.current?.focus()
  }, [])

  const handleFocusModelInput = useCallback(() => {
    modelRef.current?.focus()
  }, [])

  const handleFocusMinInput = useCallback(() => {
    minRef.current?.focus()
  }, [])

  const handleFocusMaxInput = useCallback(() => {
    maxRef.current?.focus()
  }, [])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      const address = addresses.find(
        item => item.id === Number(values.suggestedAddress)
      )
      await mutateAsync({
        active: true,
        barcode: values.barcode,
        max: Number(values.max),
        min: Number(values.min),
        productType: Number(values.productType),
        stockType: Number(values.stockType),
        unitMensuare: Number(values.unitMensuare),
        observation: values.observation,
        model: values.model,
        name: values.name,
        images: images.map(item => ({
          fileName: item.fileName!,
          uri: item.uri,
          mimeType: item.mimeType!,
        })),
        id: currentTask!.id,
        suggestedAddress: `${address!.column} | ${address!.level} ${address!.deposit ? '| ' + address!.deposit : ''}`,
      })
    },
    [mutateAsync, images, currentTask, addresses]
  )

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Nome"
            error={fieldState.error?.message}
            inputProps={{
              onSubmitEditing: handleFocusBarcodeInput,
              returnKeyType: 'next',
              submitBehavior: 'submit',
              onBlur,
              onChangeText: onChange,
              value,
            }}
          />
        )}
      />
      <Controller
        control={form.control}
        name="barcode"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Código de barras"
            error={fieldState.error?.message}
            inputProps={{
              editable: false,
              keyboardType: 'numeric',
              onSubmitEditing: handleFocusModelInput,
              returnKeyType: 'next',
              submitBehavior: 'submit',
              onBlur,
              onChangeText: onChange,
              value,
            }}
            ref={barcodeRef}
          />
        )}
      />
      <Controller
        control={form.control}
        name="model"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Modelo"
            error={fieldState.error?.message}
            inputProps={{
              onSubmitEditing: handleFocusMinInput,
              returnKeyType: 'next',
              submitBehavior: 'submit',
              onBlur,
              onChangeText: onChange,
              value,
            }}
            ref={modelRef}
          />
        )}
      />

      <View style={{ flexDirection: 'row', columnGap: 16 }}>
        <Controller
          control={form.control}
          name="min"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              containerStyle={{ flex: 1 }}
              label="Estoque mínimo"
              error={fieldState.error?.message}
              inputProps={{
                autoCapitalize: 'none',
                keyboardType: 'numeric',
                onSubmitEditing: handleFocusMaxInput,
                returnKeyType: 'next',
                submitBehavior: 'submit',
                onBlur,
                onChangeText: onChange,
                value,
              }}
              ref={minRef}
            />
          )}
        />

        <Controller
          control={form.control}
          name="max"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              containerStyle={{ flex: 1 }}
              label="Estoque máximo"
              error={fieldState.error?.message}
              inputProps={{
                autoCapitalize: 'none',
                keyboardType: 'numeric',
                returnKeyType: 'next',
                submitBehavior: 'blurAndSubmit',
                onBlur,
                onChangeText: onChange,
                value,
              }}
              ref={maxRef}
            />
          )}
        />
      </View>

      <Controller
        control={form.control}
        name="suggestedAddress"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <Addresses
            error={fieldState.error?.message}
            value={value}
            ref={addressRef}
            data={addresses || []}
            onSelect={({ id }) => {
              onChange(id.toString())
              onBlur()
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="productType"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <Select
            label="Tipo de produto"
            error={fieldState.error?.message}
            value={value}
            ref={productTypeRef}
            data={
              productTypes.map(item => ({
                label: item.description,
                value: item.id.toString(),
              })) || []
            }
            onSelect={value => {
              onChange(value)
              onBlur()
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="stockType"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <Select
            label="Tipo de estoque"
            error={fieldState.error?.message}
            value={value}
            ref={productTypeRef}
            data={
              stockTypes.map(item => ({
                label: item.description,
                value: item.id.toString(),
              })) || []
            }
            onSelect={value => {
              onChange(value)
              onBlur()
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="unitMensuare"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <Select
            label="Unidade de medida"
            error={fieldState.error?.message}
            value={value}
            ref={productTypeRef}
            data={
              unitMeasurements.map(item => ({
                label: item.name,
                value: item.id.toString(),
              })) || []
            }
            onSelect={value => {
              onChange(value)
              onBlur()
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="observation"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            containerStyle={{ flex: 1 }}
            inputStyle={{
              height: 100,
            }}
            label="Observação"
            error={fieldState.error?.message}
            inputProps={{
              returnKeyType: 'next',
              submitBehavior: 'blurAndSubmit',
              numberOfLines: 3,
              onBlur,
              onChangeText: onChange,
              value,
            }}
          />
        )}
      />

      <View style={styles.imageMainContainer}>
        <TouchableOpacity
          onPress={() => addImageRef.current?.open()}
          activeOpacity={theme.button.activeOpacity}
          style={styles.imageAddButton}>
          <ImagePlus strokeWidth={1.5} color={theme.colors.primary.green} />
          <Texts.SemiBold
            style={{
              textAlign: 'center',
              color: theme.colors.primary.green,
            }}>
            Adicionar imagem
          </Texts.SemiBold>
        </TouchableOpacity>

        {images.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => optionsImageRef.current?.open(index)}
            activeOpacity={theme.button.activeOpacity}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.productImage} />
            </View>
            <View style={styles.imageIconContainer}>
              <Ellipsis
                strokeWidth={1.5}
                color={theme.colors.background.general}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        label="Confirmar"
        disabled={isPending}
        isPending={isPending}
        onHandle={form.handleSubmit(onSubmit)}
      />

      <AddImage
        ref={addImageRef}
        openCamera={openCamera}
        openGallery={openGallery}
      />

      <OptionsImage
        viewImage={viewImage}
        removeImage={removeImage}
        ref={optionsImageRef}
      />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    rowGap: 16,
  },
  imageAddButton: {
    borderColor: theme.colors.primary.green,
    borderWidth: 1.5,
    borderStyle: 'dotted',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: Math.floor((Dimensions.get('screen').width - 64) / 3),
    height: Math.floor((Dimensions.get('screen').width - 64) / 3),
  },
  imageMainContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  imageContainer: {
    borderColor: theme.colors.primary.green,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    overflow: 'hidden',
    width: Math.floor((Dimensions.get('screen').width - 64) / 3),
    height: Math.floor((Dimensions.get('screen').width - 64) / 3),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageIconContainer: {
    backgroundColor: theme.colors.primary.green,
    alignItems: 'center',
    paddingVertical: 4,
    borderEndEndRadius: 8,
    borderStartEndRadius: 8,
  },
})
