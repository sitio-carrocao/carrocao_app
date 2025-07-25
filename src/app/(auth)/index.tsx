import Logo from '@assets/logo.png'
import SignInForm from '@components/pages/auth/signIn/Form'
import Containers from '@components/ui/containers'
import theme from '@constants/themes'
import { Image, StyleSheet, View } from 'react-native'

export default function SignIn() {
  return (
    <Containers.Keyboard>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={Logo} style={styles.image} />
        </View>
        <SignInForm />
      </View>
    </Containers.Keyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.green,
  },
  image: {
    width: 230,
    height: 150,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})
