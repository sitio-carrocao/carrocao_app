import theme from '@constants/themes'
import { type PropsWithChildren } from 'react'
import {
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

interface IProps extends ScrollViewProps, PropsWithChildren {
  style?: StyleProp<
    Pick<
      ViewStyle,
      | 'justifyContent'
      | 'gap'
      | 'paddingHorizontal'
      | 'backgroundColor'
      | 'padding'
      | 'rowGap'
    >
  >
}

export default function ScrollView({ children, style, ...props }: IProps) {
  return (
    <KeyboardAwareScrollView
      {...props}
      contentContainerStyle={[styles.scroll, style]}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator>
      {children}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.background.general,
  },
})
