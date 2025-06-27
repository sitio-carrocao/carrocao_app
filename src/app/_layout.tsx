import theme from '@constants/themes'
import Providers from '@contexts/providers'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'

import { SafeAreaView } from 'react-native-safe-area-context'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 400,
  fade: true,
})

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <SafeAreaView
        edges={['top']}
        style={{ flex: 0, backgroundColor: theme.colors.background.general }}
      />
      <SafeAreaView
        edges={['bottom']}
        style={{
          flex: 1,
        }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/sign-in" />
        </Stack>
      </SafeAreaView>
    </Providers>
  )
}
