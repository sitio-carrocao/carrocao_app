import React, {
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Platform, StyleSheet, TouchableOpacity } from 'react-native'

import theme from '@constants/themes'
import { Eye, EyeOff } from 'lucide-react-native'

import InputRoot, {
  type Props as InputRootProps,
  type RefProps as InputRootRefProps,
} from './Root'

type RefProps = InputRootRefProps

type Props = InputRootProps & {
  ref?: Ref<InputRootRefProps>
}

function InputPassword({ ref, ...props }: Props) {
  const inputRootRef = useRef<InputRootRefProps>(null)

  const [isShowingText, setIsShowingText] = useState<boolean>(false)

  const handleToggleShowing = useCallback((): void => {
    setIsShowingText(current => !current)
  }, [])

  useImperativeHandle(ref, () => ({
    focus: (): void => {
      inputRootRef.current?.focus()
    },
  }))

  return (
    <InputRoot
      {...props}
      iconRight={() => (
        <TouchableOpacity
          activeOpacity={theme.button.activeOpacity}
          hitSlop={10}
          onPress={handleToggleShowing}
          style={styles.button}>
          {isShowingText ? (
            <EyeOff
              color={theme.colors.primary.green}
              size={24}
              strokeWidth={2}
            />
          ) : (
            <Eye color={theme.colors.primary.green} size={24} strokeWidth={2} />
          )}
        </TouchableOpacity>
      )}
      inputProps={{
        ...props.inputProps,
        autoCapitalize: 'none',
        placeholder: props.inputProps?.placeholder,
        secureTextEntry: !isShowingText,
      }}
      ref={inputRootRef}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
  },
})

export type { RefProps }
export default InputPassword
