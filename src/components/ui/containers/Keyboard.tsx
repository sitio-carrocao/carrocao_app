import type { PropsWithChildren } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

export default function Keyboard({ children }: PropsWithChildren) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      style={styles.content}>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // maxHeight: 600,
  },
})
