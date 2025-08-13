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

import InternalRequestCartProvider from './internalRequestCart/provider'
import SessionProvider from './session/provider'

function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({})
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SessionProvider>
            <InternalRequestCartProvider>
              <SafeAreaProvider>
                <KeyboardProvider>
                  <BottomSheetModalProvider>
                    {children}
                    <Toast config={toast.config} />
                  </BottomSheetModalProvider>
                </KeyboardProvider>
              </SafeAreaProvider>
            </InternalRequestCartProvider>
          </SessionProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers
