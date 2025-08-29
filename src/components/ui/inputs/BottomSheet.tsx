import theme from '@constants/themes'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import {
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
  type TextInput,
  type TextInputFocusEventData,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { mask as maskParser } from 'react-native-mask-text'
import type { FormatType } from 'react-native-mask-text/lib/typescript/src/@types/FormatType'

import Texts from '../Texts'

interface IRefProps {
  focus(): void
}

interface IProps {
  error?: string
  containerStyle?: StyleProp<Pick<ViewStyle, 'flex' | 'width'>>
  fieldStyle?: StyleProp<Pick<ViewStyle, 'backgroundColor' | 'borderColor'>>
  inputStyle?: StyleProp<Pick<TextStyle, 'textAlign' | 'height'>>
  iconLeft?(): JSX.Element
  iconRight?(): JSX.Element
  inputProps?: TextInputProps
  mask?: string
  maskType?: FormatType
  ref?: Ref<IRefProps>
  label?: string
}

function InputBottomSheet({
  containerStyle = {},
  fieldStyle = {},
  inputStyle = {},
  iconLeft: IconLeft,
  iconRight: IconRight,
  inputProps = {},
  mask,
  maskType,
  ref,
  error,
  label,
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
    <View style={[containerStyle]}>
      {!!label && (
        <View style={styles.labelContainer}>
          <Texts.SemiBold
            style={{
              color: theme.colors.primary.green,
            }}>
            {label}
          </Texts.SemiBold>
          <Texts.SemiBold
            style={{
              color: theme.colors.utils.danger,
            }}>
            {error}
          </Texts.SemiBold>
        </View>
      )}
      <View
        style={[
          styles.container,
          fieldStyle,
          isFocused && styles.focused,
          error && styles.error,
        ]}>
        {IconLeft && (
          <View style={styles.iconContainer}>
            <IconLeft />
          </View>
        )}

        <BottomSheetTextInput
          {...inputProps}
          autoComplete="off"
          autoCorrect={false}
          onBlur={handleBlur}
          textAlignVertical="top"
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          selectionColor={theme.colors.text.default}
          style={[styles.input, inputStyle]}
        />

        {IconRight && (
          <View style={styles.iconContainer}>
            <IconRight />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // height:
    //   Platform.OS === 'android'
    //     ? theme.input.height.android
    //     : theme.input.height.iOS,
    alignItems: 'center',
    backgroundColor: theme.input.backgroundColor.primary,
    borderColor: theme.input.borderColor,
    borderRadius: theme.input.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    // width: '100%',
  },
  input: {
    color: theme.colors.text.default,
    fontFamily: 'Raleway',
    fontWeight: 500,
    fontSize: 16,
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
    paddingHorizontal: 8,
    includeFontPadding: false,
    flex: 1,
  },
  iconContainer: {
    paddingHorizontal: 8,
    height:
      Platform.OS === 'android'
        ? theme.input.height.android
        : theme.input.height.iOS,
  },
  error: {
    borderColor: theme.colors.utils.danger,
  },
  focused: {
    borderColor: theme.colors.primary.green,
  },
  labelContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export type { IProps as Props, IRefProps as RefProps }
export default InputBottomSheet
