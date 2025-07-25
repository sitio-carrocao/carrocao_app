import theme from '@constants/themes'
import React, { type PropsWithChildren } from 'react'
import { type StyleProp, StyleSheet, Text, type TextStyle } from 'react-native'

interface IProps extends PropsWithChildren {
  style?: StyleProp<
    Pick<
      TextStyle,
      | 'textAlign'
      | 'alignSelf'
      | 'color'
      | 'fontSize'
      | 'textDecorationLine'
      | 'paddingLeft'
      | 'paddingRight'
      | 'marginBottom'
      | 'marginTop'
      | 'paddingHorizontal'
      | 'flexShrink'
    >
  >
}

function Bold({ children, style }: IProps) {
  return <Text style={[styles.default, styles.bold, style]}>{children}</Text>
}

function Medium({ children, style }: IProps) {
  return <Text style={[styles.default, styles.medium, style]}>{children}</Text>
}

function Regular({ children, style }: IProps) {
  return <Text style={[styles.default, styles.regular, style]}>{children}</Text>
}

function SemiBold({ children, style }: IProps) {
  return (
    <Text style={[styles.default, styles.semiBold, style]}>{children}</Text>
  )
}

const styles = StyleSheet.create({
  default: {
    color: theme.colors.text.default,
    fontSize: 14,
    includeFontPadding: false,
  },
  bold: {
    fontFamily: 'Raleway',
    fontWeight: 700,
  },
  semiBold: {
    fontFamily: 'Raleway',
    fontWeight: 600,
  },
  medium: {
    fontFamily: 'Raleway',
    fontWeight: 500,
  },
  regular: {
    fontFamily: 'Raleway',
    fontWeight: 400,
  },
})

const Texts = {
  Bold,
  Medium,
  Regular,
  SemiBold,
}

export default Texts
