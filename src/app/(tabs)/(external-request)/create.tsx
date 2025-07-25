import ExternalRequestCreateForm from '@components/pages/tabs/external-request/create/Form'
import Containers from '@components/ui/containers'
import theme from '@constants/themes'
import { StyleSheet, View } from 'react-native'

export default function TabExternalRequestCreate() {
  return (
    <View style={styles.container}>
      <Containers.Scroll style={{ rowGap: 16 }}>
        <ExternalRequestCreateForm />
      </Containers.Scroll>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
})
