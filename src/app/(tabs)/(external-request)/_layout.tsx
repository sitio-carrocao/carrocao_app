import theme from '@constants/themes'
import { Link, Stack } from 'expo-router'
import { CirclePlus } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

export default function ExternalRequestLayout() {
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
          title: 'Solicitações externas',
          headerRight: ({ tintColor }) => (
            <Link asChild href="/(tabs)/(external-request)/create">
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
        name="[id]"
        options={{
          title: 'Solicitação externa',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Solicitar compra de produto',
        }}
      />
      <Stack.Screen
        name="image"
        options={{
          title: 'Imagem do produto',
        }}
      />
    </Stack>
  )
}
