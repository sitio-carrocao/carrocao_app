import type { formExternalRequestInitialSchema } from '@app/(tabs)/(external-request)'
import Button from '@components/ui/Button'
import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { format, parseISO } from 'date-fns'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { z } from 'zod'

import Status from './Status'

interface IProps {
  onSubmit(): void
  onClear(): void
}

export default function ExternalRequestInitialHeader({
  onSubmit,
  onClear,
}: IProps) {
  const form =
    useFormContext<z.infer<typeof formExternalRequestInitialSchema>>()

  const handleShowStartDate = () => {
    DateTimePickerAndroid.open({
      value: parseISO(form.getValues('startDate')),
      onChange: (_, date) => {
        if (date) {
          form.setValue('startDate', format(date, 'yyyy-MM-dd'))
        }
      },
      maximumDate: parseISO(form.getValues('endDate')),
      mode: 'date',
    })
  }

  const handleShowEndDate = () => {
    DateTimePickerAndroid.open({
      value: parseISO(form.getValues('endDate')),
      onChange: (_, date) => {
        if (date) {
          form.setValue('endDate', format(date, 'yyyy-MM-dd'))
        }
      },
      minimumDate: parseISO(form.getValues('startDate')),
      mode: 'date',
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.statusContainer}>
          <Texts.SemiBold
            style={{
              marginBottom: 4,
              color: theme.colors.primary.green,
            }}>
            Data inicial
          </Texts.SemiBold>
          <TouchableOpacity
            onPress={handleShowStartDate}
            activeOpacity={theme.button.activeOpacity}
            style={styles.options}>
            <Texts.SemiBold>
              {format(parseISO(form.watch('startDate')), 'dd/MM/yyyy')}
            </Texts.SemiBold>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <Texts.SemiBold
            style={{
              marginBottom: 4,
              color: theme.colors.primary.green,
            }}>
            Data final
          </Texts.SemiBold>
          <TouchableOpacity
            onPress={handleShowEndDate}
            activeOpacity={theme.button.activeOpacity}
            style={styles.options}>
            <Texts.SemiBold>
              {format(parseISO(form.watch('endDate')), 'dd/MM/yyyy')}
            </Texts.SemiBold>
          </TouchableOpacity>
        </View>

        <View>
          <Texts.SemiBold
            style={{
              marginBottom: 4,
              color: theme.colors.primary.green,
            }}>
            Status
          </Texts.SemiBold>
          <Status
            value={form.watch('status') as string}
            onSelect={value => form.setValue('status', value)}
          />
        </View>
      </View>

      <Controller
        control={form.control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <Inputs.Root
            inputProps={{
              placeholder: 'Nome do produto',
              returnKeyType: 'search',
              submitBehavior: 'blurAndSubmit',
              onSubmitEditing: onSubmit,
              autoCorrect: false,
              onBlur,
              onChangeText: onChange,
              value,
            }}
          />
        )}
      />

      <View style={styles.buttonsContainer}>
        <Button
          label="LIMPAR"
          containerStyle={{
            backgroundColor: theme.colors.utils.danger,
            flex: 1,
          }}
          onHandle={onClear}
        />
        <Button
          containerStyle={{
            flex: 1,
          }}
          onHandle={onSubmit}
          label="PESQUISAR"
        />
      </View>

      <View style={styles.separator} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
  },
  statusContainer: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 8,
  },
  options: {
    borderWidth: 1.5,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    paddingHorizontal: 4,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1.5,
    backgroundColor: `${theme.input.borderColor}4D`,
    width: '100%',
    marginVertical: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    columnGap: 8,
  },
})
