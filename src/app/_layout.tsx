import Providers from '@contexts/providers'
import useSession from '@contexts/session'
import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

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
  const { session, isLoading } = useSession()

  useEffect(() => {
    if (!session && !isLoading) {
      router.replace({
        pathname: '/(auth)',
      })
    }
  }, [session, isLoading])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="qr-code-camera" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="barcode-camera" />
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
