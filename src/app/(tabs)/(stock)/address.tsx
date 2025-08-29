import Button from '@components/ui/Button'
import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useStock from '@contexts/stock'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import StockService from '@services/stock/StockService'
import { useMutation } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { ScanQrCode } from 'lucide-react-native'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

export default function TabStockAddress() {
  const { onLoadCurrentTask, onLoadTasks, currentTask, addresses } = useStock()

  const formSchema = z
    .object({
      address: z.string().min(1, {
        message: 'O campo é obrigatório',
      }),
      expirationDate: z.string(),
      batch: z.string().min(1, {
        message: 'O campo é obrigatório',
      }),
    })
    .superRefine((val, ctx) => {
      if (currentTask?.validateDateRequired && !val.expirationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O campo é obrigatório',
          path: ['expirationDate'],
        })
      }
    })

  const { qrcode } = useLocalSearchParams<{
    qrcode?: string
  }>()
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
          form.setValue('expirationDate', format(date, 'yyyy-MM-dd'), {
            shouldValidate: true,
          })
        }
      },
      minimumDate: new Date(),
      mode: 'date',
    })
  }

  const { isPending, mutateAsync } = useMutation({
    mutationFn: StockService.createProductStock,
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

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      await mutateAsync({
        batch: values.batch,
        id: currentTask!.id,
        productExpirationDate: values.expirationDate || null,
        stockAddressId: Number(values.address),
        value: currentTask!.value,
      })
    },
    [mutateAsync, currentTask]
  )

  useEffect(() => {
    if (qrcode) {
      form.setValue('address', qrcode)
    }
  }, [qrcode, form])

  const address = useMemo(() => {
    if (qrcode) {
      const findAddress = addresses.find(item => item.id === Number(qrcode))
      return `${findAddress?.column} | ${findAddress?.level} ${findAddress?.deposit ? '| ' + findAddress.deposit : ''}`
    }
    return ''
  }, [qrcode, addresses])

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Descrição
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {currentTask?.description}
        </Texts.Bold>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.flex}>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Quantidade
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>
            {currentTask?.quantity} {currentTask?.unitMeasurement}
          </Texts.Bold>
        </View>

        <View style={styles.flex}>
          <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
            Código de barra
          </Texts.SemiBold>
          <Texts.Bold style={{ fontSize: 18 }}>
            {currentTask?.barcode}
          </Texts.Bold>
        </View>
      </View>

      <View>
        <Texts.SemiBold style={{ color: theme.colors.primary.green }}>
          Endereço sugerido
        </Texts.SemiBold>
        <Texts.Bold style={{ fontSize: 18 }}>
          {currentTask?.suggestedAddress
            ? `${currentTask.suggestedAddress.column} | ${currentTask.suggestedAddress.level} ${currentTask.suggestedAddress.deposit ? '| ' + currentTask.suggestedAddress.deposit : ''}`
            : currentTask?.adminSuggestedAddress}
        </Texts.Bold>
      </View>

      <View style={styles.line} />

      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', columnGap: 8 }}>
        <Controller
          control={form.control}
          name="address"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <Inputs.Root
              containerStyle={{ flex: 1 }}
              label="Endereço"
              error={fieldState.error?.message}
              inputProps={{
                editable: false,
                autoCapitalize: 'none',
                keyboardType: 'numeric',
                returnKeyType: 'done',
                submitBehavior: 'submit',
                onBlur,
                onChangeText: onChange,
                value: address,
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
        render={({ field: { value }, fieldState }) => (
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Texts.SemiBold
                style={{
                  marginBottom: 4,
                  color: theme.colors.primary.green,
                }}>
                Data de validade
              </Texts.SemiBold>

              <Texts.SemiBold
                style={{
                  color: theme.colors.utils.danger,
                }}>
                {fieldState.error?.message}
              </Texts.SemiBold>
            </View>

            <TouchableOpacity
              onPress={handleShowDatepicker}
              activeOpacity={theme.button.activeOpacity}
              style={[
                styles.options,
                fieldState.error?.message && {
                  borderColor: theme.colors.utils.danger,
                },
              ]}>
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
