import { type formInternalRequestCreateSchema } from '@app/(tabs)/(internal-request)/create'
import Button from '@components/ui/Button'
import Inputs from '@components/ui/inputs'
import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import type { z } from 'zod'

interface IProps {
  onSubmit(): void
  onClear(): void
}

export default function InternalRequestCreateHeader({
  onSubmit,
  onClear,
}: IProps) {
  const form = useFormContext<z.infer<typeof formInternalRequestCreateSchema>>()

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <View>
            <Texts.SemiBold
              style={{
                marginBottom: 4,
                color: theme.colors.primary.green,
              }}>
              Produto
            </Texts.SemiBold>
            <Inputs.Root
              inputProps={{
                autoCapitalize: 'none',
                keyboardType: 'default',
                onSubmitEditing: onSubmit,
                returnKeyType: 'next',
                submitBehavior: 'blurAndSubmit',
                onBlur,
                onChangeText: onChange,
                value,
              }}
            />
          </View>
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
