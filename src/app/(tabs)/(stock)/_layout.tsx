import theme from '@constants/themes'
import { Link, Stack } from 'expo-router'
import { CirclePlus } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

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
          title: 'Armazenar estoque',
          headerRight: ({ tintColor }) => (
            <Link asChild href="/(tabs)/(stock)/create">
              <TouchableOpacity
                activeOpacity={theme.button.activeOpacity}
                hitSlop={10}>
                <CirclePlus color={tintColor} strokeWidth={1.5} size={30} />
              </TouchableOpacity>
            </Link>
          ),
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
          title: 'Adicionar produto',
        }}
      />
    </Stack>
  )
}
