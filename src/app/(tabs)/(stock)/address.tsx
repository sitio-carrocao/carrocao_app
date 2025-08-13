import Addresses, {
  type IRefProps as AddressRef,
} from '@components/pages/tabs/stock/address/Addresses'
import Button from '@components/ui/Button'
import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import StockService from '@services/stock/StockService'
import StockAddressService from '@services/stockAddress/StockAddressService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { ScanQrCode } from 'lucide-react-native'
import { useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

const formSchema = z.object({
  address: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  expirationDate: z.string(),
  batch: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
})

export default function TabStockAddress() {
  const queryClient = useQueryClient()
  const { qrcode } = useLocalSearchParams<{
    qrcode?: string
  }>()
  const addressRef = useRef<AddressRef>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      address: '',
      batch: new Date().toISOString().split('T')[0].split('-').join(''),
      expirationDate: '',
    },
  })

  const handleShowDatepicker = () => {
    DateTimePickerAndroid.open({
      value: parseISO(form.getValues('expirationDate')),
      onChange: (_, date) => {
        if (date) {
          form.setValue('expirationDate', format(date, 'yyyy-MM-dd'))
        }
      },
      minimumDate: new Date(),
      mode: 'date',
    })
  }

  const { data } = useQuery({
    queryFn: async () => {
      const response = await StockService.getValidatedProductDetails()
      return response
    },
    queryKey: ['validatedProductDetails'],
    refetchOnWindowFocus: false,
  })

  const { data: addresses } = useQuery({
    queryFn: async () => {
      const response = await StockAddressService.getAll({})
      return response
    },
    queryKey: ['stockAddresses'],
    refetchOnWindowFocus: false,
  })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.createProductStock,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar a operação, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['validatedProducts'],
      })
      queryClient.resetQueries({
        queryKey: ['validatedProductDetails'],
      })
      router.dismissTo({
        pathname: '/(tabs)/(stock)',
      })
      toast.show({
        message: 'Produto registrado com sucesso',
        title: 'Parabéns',
        type: 'success',
      })
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      await mutateAsync({
        batch: values.batch,
        id: data!.id,
        productExpirationDate: values.expirationDate || null,
        stockAddressId: Number(values.address),
        value: data!.value,
      })
    },
    [mutateAsync, data]
  )

  useEffect(() => {
    if (qrcode) {
      form.setValue('address', qrcode)
    }
  }, [qrcode, form])

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Descrição
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>{data?.description}</Texts.Bold>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.flex}>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Quantidade
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>
            {data?.quantity} {data?.unitMeasurement}
          </Texts.Bold>
        </View>

        <View style={styles.flex}>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Código de barra
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>{data?.barcode}</Texts.Bold>
        </View>
      </View>

      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Endereço sugerido
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {data?.suggestedAddress
            ? `${data.suggestedAddress.column} | ${data.suggestedAddress.level} ${data.suggestedAddress.deposit ? '| ' + data.suggestedAddress.deposit : ''}`
            : 'Não informado'}
        </Texts.Bold>
      </View>

      <View style={styles.line} />

      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', columnGap: 8 }}>
        <Controller
          control={form.control}
          name="address"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <Addresses
              error={fieldState.error?.message}
              value={value}
              ref={addressRef}
              data={addresses?.list || []}
              onSelect={({ id }) => {
                onChange(id.toString())
                onBlur()
              }}
            />
          )}
        />
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: '/qr-code-camera',
              params: {
                path: '/(tabs)/(stock)/address',
              },
            })
          }
          activeOpacity={theme.button.activeOpacity}
          style={styles.qrCodeButton}>
          <ScanQrCode color={theme.colors.background.general} />
        </TouchableOpacity>
      </View>

      <Controller
        control={form.control}
        name="batch"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Lote"
            error={fieldState.error?.message}
            inputProps={{
              autoCapitalize: 'none',
              keyboardType: 'numeric',
              returnKeyType: 'done',
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
        name="expirationDate"
        render={({ field: { value } }) => (
          <View>
            <Texts.SemiBold
              style={{
                marginBottom: 4,
                color: theme.colors.primary.green,
              }}>
              Data de validade
            </Texts.SemiBold>
            <TouchableOpacity
              onPress={handleShowDatepicker}
              activeOpacity={theme.button.activeOpacity}
              style={styles.options}>
              <Texts.SemiBold>
                {value ? format(parseISO(value), 'dd/MM/yyyy') : ''}
              </Texts.SemiBold>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        containerStyle={{ marginTop: 32 }}
        label="Concluir"
        onHandle={form.handleSubmit(onSubmit)}
        disabled={isPending}
        isPending={isPending}
      />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    rowGap: 16,
    flexGrow: 1,
  },
  options: {
    borderWidth: 1.5,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    paddingHorizontal: 16,
    height: 43,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  labelContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    backgroundColor: theme.colors.primary.orange + '4D',
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  qrCodeButton: {
    backgroundColor: theme.colors.primary.orange,
    height: theme.button.height.android,
    width: theme.button.height.android,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.button.borderRadius,
  },
})
