import React, {
  type JSX,
  type Ref,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import {
  type NativeSyntheticEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputFocusEventData,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native'
import { mask as maskParser } from 'react-native-mask-text'
import type { FormatType } from 'react-native-mask-text/lib/typescript/src/@types/FormatType'

import theme from '@constants/themes'

interface IRefProps {
  focus(): void
}

interface IProps {
  error?: string
  fieldStyle?: StyleProp<
    Pick<ViewStyle, 'backgroundColor' | 'borderColor' | 'flex'>
  >
  iconLeft?(): JSX.Element
  iconRight?(): JSX.Element
  inputProps?: TextInputProps
  mask?: string
  maskType?: FormatType
  ref?: Ref<IRefProps>
}

function InputRoot({
  fieldStyle = {},
  iconLeft: IconLeft,
  iconRight: IconRight,
  inputProps = {},
  mask,
  maskType,
  ref,
}: IProps) {
  const inputRef = useRef<TextInput & TextInputProps>(null)

  const [isFocused, setIsFocused] = useState<boolean>(false)

  function handleFocus(): void {
    setIsFocused(true)
  }

  function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setIsFocused(false)
    if (inputProps.onBlur) {
      inputProps.onBlur(e)
    }
  }

  const handleChangeText = (text: string) => {
    if (!inputProps.onChangeText) {
      return
    }
    if (mask) {
      inputProps.onChangeText(maskParser(text, mask, maskType))
    } else {
      inputProps.onChangeText(text)
    }
  }

  useImperativeHandle(ref, () => ({
    focus: (): void => {
      inputRef.current?.focus()
    },
  }))

  return (
    <View
      style={[
        styles.container,
        fieldStyle,
        isFocused && { borderColor: theme.colors.primary.green },
      ]}>
      {IconLeft && (
        <View style={styles.iconContainer}>
          <IconLeft />
        </View>
      )}

      <TextInput
        {...inputProps}
        autoComplete="off"
        autoCorrect={false}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        placeholderTextColor={theme.colors.text.default}
        ref={inputRef}
        selectionColor={theme.colors.text.default}
        style={styles.input}
      />

      {IconRight && (
        <View style={styles.iconContainer}>
          <IconRight />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
    alignItems: 'center',
    backgroundColor: theme.input.backgroundColor.primary,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
  },
  input: {
    color: theme.colors.text.default,
    fontFamily: 'Raleway',
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 22,
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
    paddingHorizontal: 8,
    includeFontPadding: false,
  },
  iconContainer: {
    paddingHorizontal: 8,
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
  },
})

export type { IProps as Props, IRefProps as RefProps }
export default InputRoot
