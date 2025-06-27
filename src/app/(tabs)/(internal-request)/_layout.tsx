import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import useInternalRequestCart from '@contexts/internalRequestCart'
import { Link, Stack } from 'expo-router'
import { CirclePlus, ShoppingCart } from 'lucide-react-native'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export default function InternalRequestLayout() {
  const { products } = useInternalRequestCart()

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
          title: 'Solicitações internas',
          headerRight: ({ tintColor }) => (
            <Link asChild href="/(tabs)/(internal-request)/create">
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
          title: 'Solicitação interna',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Nova solicitação interna',
          headerRight: ({ tintColor }) => (
            <Link asChild href="/(tabs)/(internal-request)/cart">
              <TouchableOpacity
                style={styles.button}
                activeOpacity={theme.button.activeOpacity}
                hitSlop={10}>
                <ShoppingCart color={tintColor} strokeWidth={1.5} size={28} />
                {!!products.length && (
                  <View style={styles.badge}>
                    <Texts.Medium
                      style={{
                        color: theme.colors.background.general,
                        marginBottom: 3,
                      }}>
                      {products.length}
                    </Texts.Medium>
                  </View>
                )}
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          title: 'Carrinho solicitação interna',
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    paddingRight: 8,
    paddingTop: 4,
  },
  badge: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary.orange,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
  },
})
