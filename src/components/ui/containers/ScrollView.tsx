import React, { type PropsWithChildren } from 'react'

import {
  ScrollView as ScrollViewNative,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'

import theme from '@constants/themes'

interface IProps extends ScrollViewProps, PropsWithChildren {
  style?: StyleProp<
    Pick<
      ViewStyle,
      | 'justifyContent'
      | 'gap'
      | 'paddingHorizontal'
      | 'backgroundColor'
      | 'padding'
    >
  >
}

function ScrollView({ children, style, ...props }: IProps) {
  return (
    <ScrollViewNative
      {...props}
      contentContainerStyle={[styles.scroll, style]}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator>
      {children}
    </ScrollViewNative>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.background.general,
  },
})

export default ScrollView
