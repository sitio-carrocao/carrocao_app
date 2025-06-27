import Forms from '@components/forms'
import theme from '@constants/themes'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabExternalRequestCreate() {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAwareScrollView
      bottomOffset={5}
      extraKeyboardSpace={-insets.bottom}
      contentContainerStyle={styles.contentContainer}>
      <Forms.ExternalRequestCreate />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.background.general,
  },
})
