import React from 'react'

import {
  ActivityIndicator,
  ActivityIndicatorComponent,
  Image,
  type ImageURISource,
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native'

import theme from '@constants/themes'

interface IButtonProps {
  containerStyle?: StyleProp<
    Pick<
      ViewStyle,
      | 'backgroundColor'
      | 'borderColor'
      | 'marginTop'
      | 'width'
      | 'flex'
      | 'padding'
      | 'marginHorizontal'
      | 'marginVertical'
      | 'marginBottom'
    >
  >
  disabled?: boolean
  isPending?: boolean
  icon?: ImageURISource
  label?: string
  labelStyle?: StyleProp<Pick<TextStyle, 'color' | 'fontSize'>>
  onHandle?(): void
}

const Button = ({
  containerStyle,
  disabled,
  icon,
  label,
  labelStyle,
  onHandle,
  isPending,
}: IButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.button.activeOpacity}
      disabled={disabled}
      onPress={onHandle}
      style={[
        styles.button,
        containerStyle,
        disabled && styles.buttonDisabled,
      ]}>
      {label && !isPending && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      {label && isPending && (
        <ActivityIndicator color={labelStyle?.color || styles.label.color} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.button.borderRadius,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight:
      Platform.OS === 'android'
        ? theme.button.height.android
        : theme.button.height.iOS,
    padding: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: theme.colors.background.general,
    fontFamily: 'Raleway',
    fontWeight: 600,
    fontSize: 18,
    includeFontPadding: false,
  },
})

export default Button
