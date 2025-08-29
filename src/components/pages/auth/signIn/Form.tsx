import Button from '@components/ui/Button'
import Inputs, {
  type PasswordRefProps,
  type RootRefProps,
} from '@components/ui/inputs'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import useSession from '@contexts/session'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthService from '@services/auth/AuthService'
import type ISignInInputData from '@services/auth/dtos/signIn/InputData'
import type ISignInOutputData from '@services/auth/dtos/signIn/OutputData'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform, StyleSheet, View } from 'react-native'
import { z } from 'zod'

const formSchema = z.object({
  code: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  password: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
})

function SignInForm() {
  const { saveToken, saveCode } = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      code: '',
      password: '',
    },
  })

  const inputCodeRef = useRef<RootRefProps>(null)
  const inputPasswordRef = useRef<PasswordRefProps>(null)

  const { isPending, mutateAsync } = useMutation<
    ISignInOutputData,
    unknown,
    ISignInInputData
  >({
    mutationFn: AuthService.signIn,
    onError: () => {
      toast.show({
        message: 'Não foi possível realizar o login, tente novamente',
        title: 'ATENÇÃO',
        type: 'error',
      })
    },
    onSuccess: (response, variables) => {
      saveToken(response.token)
      saveCode(variables.code)
      router.replace({
        pathname: '/(tabs)/(internal-request)',
      })
    },
  })

  const handleFocusInputCode = useCallback((): void => {
    inputPasswordRef.current?.focus()
  }, [])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      await mutateAsync({
        code: values.code,
        password: values.password,
      })
    },
    [mutateAsync]
  )

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="code"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Root
            label="Código"
            error={fieldState.error?.message}
            inputProps={{
              autoCapitalize: 'none',
              keyboardType: 'numeric',
              onSubmitEditing: handleFocusInputCode,
              returnKeyType: 'next',
              submitBehavior: 'submit',
              onBlur,
              onChangeText: onChange,
              value,
            }}
            ref={inputCodeRef}
          />
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <Inputs.Password
            label="Senha"
            error={fieldState.error?.message}
            inputProps={{
              autoCapitalize: 'none',
              onSubmitEditing: form.handleSubmit(onSubmit),
              returnKeyType: 'done',
              onBlur,
              onChangeText: onChange,
              value,
            }}
            ref={inputPasswordRef}
          />
        )}
      />

      <Button
        disabled={isPending}
        isPending={isPending}
        label="Entrar"
        onHandle={form.handleSubmit(onSubmit)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    backgroundColor: theme.colors.background.general,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
  },
  inputButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
  },
})

export default SignInForm
