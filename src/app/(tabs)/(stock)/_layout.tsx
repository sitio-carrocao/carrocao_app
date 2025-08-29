import theme from '@constants/themes'
import StockProvider from '@contexts/stock/provider'
import { Stack } from 'expo-router'

export default function StockLayout() {
  return (
    <StockProvider>
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
            title: 'Armazenar estoque',
          }}
        />
        <Stack.Screen
          name="address"
          options={{
            title: 'Adicionar endereço',
          }}
        />
        <Stack.Screen
          name="product"
          options={{
            title: 'Cadastrar produto',
          }}
        />
        <Stack.Screen
          name="image"
          options={{
            title: 'Imagem do produto',
          }}
        />
      </Stack>
    </StockProvider>
  )
}
