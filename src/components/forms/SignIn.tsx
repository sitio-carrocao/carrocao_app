import React, { useCallback, useRef } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { Platform, StyleSheet, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import Inputs, {
  type PasswordRefProps,
  type RootRefProps,
} from '@components/ui/inputs'
import toast from '@components/ui/toast'

import AuthService from '@services/auth/AuthService'

import theme from '@constants/themes'
import useSession from '@contexts/session'
import type ISignInInputData from '@services/auth/dtos/signIn/InputData'
import type ISignInOutputData from '@services/auth/dtos/signIn/OutputData'
import { router, useRouter } from 'expo-router'

const formSchema = z.object({
  code: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  password: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
})

function SignInForm() {
  const { saveToken } = useSession()
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
    onSuccess: response => {
      saveToken(response.token)
      // router.replace({
      //   pathname: '/',
      // })
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
        render={({ field: { onBlur, onChange, value } }) => (
          <View>
            <Texts.SemiBold
              style={{
                marginBottom: 4,
                color: theme.colors.primary.green,
              }}>
              Código
            </Texts.SemiBold>
            <Inputs.Root
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
              mask={
                value && /^\d+$/.test(value.substring(0, 3))
                  ? '999.999.999-99'
                  : undefined
              }
              ref={inputCodeRef}
            />
          </View>
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <View>
            <Texts.SemiBold
              style={{
                marginBottom: 4,
                color: theme.colors.primary.green,
              }}>
              Senha
            </Texts.SemiBold>
            <Inputs.Password
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
          </View>
        )}
      />

      <Button
        disabled={isPending}
        label="Entrar"
        onHandle={form.handleSubmit(onSubmit)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    marginVertical: 32,
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
