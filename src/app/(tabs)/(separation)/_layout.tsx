import theme from '@constants/themes'
import SeparationProvider from '@contexts/separation/provider'
import { Stack } from 'expo-router'

export default function SeparationLayout() {
  return (
    <SeparationProvider>
      <Stack
        screenOptions={{
          headerTintColor: theme.colors.background.general,
          headerStyle: {
            backgroundColor: theme.colors.primary.green,
          },
          headerTitleStyle: {
            fontFamily: 'Raleway',
            fontWeight: 600,
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Separação de pedidos',
          }}
        />
        <Stack.Screen
          name="task"
          options={{
            title: 'Separar pedido',
          }}
        />
      </Stack>
    </SeparationProvider>
  )
}
