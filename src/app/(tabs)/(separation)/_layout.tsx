import theme from '@constants/themes'
import { Stack } from 'expo-router'

export default function StockLayout() {
  return (
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
  )
}
