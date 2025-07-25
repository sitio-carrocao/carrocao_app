import Button from '@components/ui/Button'
import Inputs, { type RootRefProps } from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import { zodResolver } from '@hookform/resolvers/zod'
import StockService from '@services/stock/StockService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { z } from 'zod'

import AddImage, { type IPropsRef as AddImageRef } from './AddImage'
import OptionsImage, { type IPropsRef as OptionsImageRef } from './OptionsImage'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Obrigatório',
  }),
  whereUsed: z.string().min(1, {
    message: 'Obrigatório',
  }),
  model: z.string().min(1, {
    message: 'Obrigatório',
  }),
  brand: z.string().min(1, {
    message: 'Obrigatório',
  }),
  details: z.string().min(1, {
    message: 'Obrigatório',
  }),
  color: z.string().min(1, {
    message: 'Obrigatório',
  }),
  quantity: z.string().min(1, {
    message: 'Obrigatório',
  }),
})

export default function ExternalRequestCreateForm() {
  const queryClient = useQueryClient()
  const [status, requestPermission] = ImagePicker.useCameraPermissions()
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])
  const addImageRef = useRef<AddImageRef>(null)
  const optionsImageRef = useRef<OptionsImageRef>(null)

  const inputModelRef = useRef<RootRefProps>(null)
  const inputBrandRef = useRef<RootRefProps>(null)
  const inputColorRef = useRef<RootRefProps>(null)
  const inputQuantityRef = useRef<RootRefProps>(null)
  const inputDetailsRef = useRef<RootRefProps>(null)
  const inputWhereUsedRef = useRef<RootRefProps>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      details: '',
      whereUsed: '',
      model: '',
      brand: '',
      color: '',
      quantity: '',
    },
  })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.createExternalRequest,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a solicitação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['externalRequest'],
      })
      queryClient.invalidateQueries({
        queryKey: ['externalRequestDetails'],
      })
      router.dismissTo({
        pathname: '/(tabs)/(external-request)',
      })

      toast.show({
        message: 'Solicitação enviada com sucesso',
        title: 'PARABÉNS',
        type: 'success',
      })
    },
  })

  const openGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
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
      quality: 1,
    })
    if (!result.canceled) {
      setImages(oldState => {
        return oldState.concat(result.assets[0])
      })
    }
  }, [requestPermission, status])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      if (!images.length) {
        toast.show({
          title: 'ATENÇÃO',
          message: 'É necessário adicionar imagens do produto',
          type: 'error',
        })
        return
      }
      await mutateAsync({
        brand: values.brand,
        color: values.color,
        details: values.details,
        model: values.model,
        name: values.name,
        whereUsed: values.whereUsed,
        quantity: Number(values.quantity),
        images: images.map(item => ({
          fileName: item.fileName!,
          uri: item.uri,
          mimeType: item.mimeType!,
        })),
      })
    },
    [mutateAsync, images]
  )

  const removeImage = useCallback((index: number) => {
    setImages(oldState => {
      return oldState.filter((_, currentIndex) => currentIndex !== index)
    })
  }, [])

  const viewImage = useCallback(
    (index: number) => {
      router.navigate({
        pathname: '/(tabs)/(external-request)/image',
        params: {
          uri: images[index].uri,
        },
      })
    },
    [images]
  )

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Nome"
            error={fieldState.error?.message}
            inputProps={{
              autoComplete: 'off',
              autoCorrect: false,
              returnKeyType: 'next',
              submitBehavior: 'submit',
              onSubmitEditing() {
                inputModelRef.current?.focus()
              },
              onBlur,
              onChangeText: onChange,
              value,
            }}
          />
        )}
      />

      <View style={styles.row}>
        <Controller
          control={form.control}
          name="model"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              containerStyle={{ flex: 1 }}
              label="Modelo"
              ref={inputModelRef}
              error={fieldState.error?.message}
              inputProps={{
                onSubmitEditing() {
                  inputBrandRef.current?.focus()
                },
                autoComplete: 'off',
                autoCorrect: false,
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
          name="brand"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              containerStyle={{ flex: 1 }}
              label="Marca"
              ref={inputBrandRef}
              error={fieldState.error?.message}
              inputProps={{
                onSubmitEditing() {
                  inputColorRef.current?.focus()
                },
                autoComplete: 'off',
                autoCorrect: false,
                returnKeyType: 'next',
                submitBehavior: 'submit',
                onBlur,
                onChangeText: onChange,
                value,
              }}
            />
          )}
        />
      </View>

      <View style={styles.row}>
        <Controller
          control={form.control}
          name="color"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              ref={inputColorRef}
              containerStyle={{ flex: 1 }}
              label="Cor"
              error={fieldState.error?.message}
              inputProps={{
                onSubmitEditing() {
                  inputQuantityRef.current?.focus()
                },
                autoComplete: 'off',
                autoCorrect: false,
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
          name="quantity"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <Inputs.Root
              ref={inputQuantityRef}
              containerStyle={{ flex: 1 }}
              label="Quantidade"
              error={fieldState.error?.message}
              inputProps={{
                onSubmitEditing() {
                  inputDetailsRef.current?.focus()
                },
                autoComplete: 'off',
                keyboardType: 'numeric',
                autoCorrect: false,
                returnKeyType: 'next',
                submitBehavior: 'submit',
                onBlur,
                onChangeText: onChange,
                value,
              }}
            />
          )}
        />
      </View>

      <Controller
        control={form.control}
        name="details"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            ref={inputDetailsRef}
            label="Especificações técnicas"
            error={fieldState.error?.message}
            inputStyle={{ height: 80 }}
            inputProps={{
              onSubmitEditing() {
                inputWhereUsedRef.current?.focus()
              },
              numberOfLines: 2,
              autoComplete: 'off',
              autoCorrect: false,
              multiline: true,
              returnKeyType: 'next',
              submitBehavior: 'newline',
              onBlur,
              onChangeText: onChange,
              value,
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="whereUsed"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            ref={inputWhereUsedRef}
            label="Onde será utilizado"
            error={fieldState.error?.message}
            inputStyle={{ height: 80 }}
            inputProps={{
              numberOfLines: 2,
              autoComplete: 'off',
              autoCorrect: false,
              multiline: true,
              returnKeyType: 'next',
              submitBehavior: 'newline',
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
        label="Solicitar compra"
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
  },
  row: {
    flexDirection: 'row',
    columnGap: 16,
  },
  imageMainContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
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
