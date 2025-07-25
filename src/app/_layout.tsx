import Providers from '@contexts/providers'
import useSession from '@contexts/session'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 400,
  fade: true,
})

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

function SplashScreenController() {
  const { isLoading } = useSession()

  if (!isLoading) {
    SplashScreen.hide()
  }

  return null
}

function RootLayout() {
  const { session } = useSession()

  return (
    // {/* <SafeAreaView
    //   edges={['top']}
    //   style={{ flex: 0, backgroundColor: theme.colors.background.general }}
    // /> */}
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function Root() {
  return (
    <Providers>
      <StatusBar style="light" />
      <SplashScreenController />
      <RootLayout />
    </Providers>
  )
}
