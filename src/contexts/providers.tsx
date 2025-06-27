import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import type { PropsWithChildren } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import 'react-native-reanimated'
import toast from '@components/ui/toast'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import Toast from 'react-native-toast-message'
import SessionProvider from './session/provider'

function Providers({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme()
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SessionProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <KeyboardProvider>
                  {children}
                  <Toast config={toast.config} />
                </KeyboardProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers
