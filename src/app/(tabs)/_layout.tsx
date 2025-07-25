import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import InternalRequestCartProvider from '@contexts/internalRequestCart/provider'
import { Tabs } from 'expo-router'
import {
  Layers,
  NotebookPen,
  NotepadText,
  PackageSearch,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const unstable_settings = {
  initialRouteName: '(internal-request)',
}

export default function TabLayout() {
  return (
    <InternalRequestCartProvider>
      <SafeAreaView
        edges={['bottom']}
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary.green,
        }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary.orange,
            tabBarInactiveTintColor: theme.colors.background.general,
            tabBarLabelPosition: 'below-icon',
            tabBarStyle: {
              backgroundColor: theme.colors.primary.green,
              height: 70,
              paddingBottom: 0,
              paddingTop: 4,
              shadowColor: 'transparent',
            },
          }}>
          <Tabs.Screen
            name="(internal-request)"
            options={{
              title: 'Solicitações internas',
              tabBarLabel: ({ color }) => (
                <Texts.Medium
                  style={{ color, fontSize: 10, textAlign: 'center' }}>
                  Solicitações internas
                </Texts.Medium>
              ),
              tabBarIcon: ({ color }) => (
                <NotepadText color={color} size={26} strokeWidth={1.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="(external-request)"
            options={{
              title: 'Solicitações externas',
              tabBarLabel: ({ color }) => (
                <Texts.Medium
                  style={{ color, fontSize: 10, textAlign: 'center' }}>
                  Solicitações externas
                </Texts.Medium>
              ),
              tabBarIcon: ({ color }) => (
                <NotebookPen color={color} size={26} strokeWidth={1.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="(stock)"
            options={{
              title: 'Armazenar estoque',
              tabBarLabel: ({ color }) => (
                <Texts.Medium
                  style={{ color, fontSize: 10, textAlign: 'center' }}>
                  Armazenar estoque
                </Texts.Medium>
              ),
              tabBarIcon: ({ color }) => (
                <Layers color={color} size={26} strokeWidth={1.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="(separation)"
            options={{
              title: 'Separação de produtos',
              tabBarLabel: ({ color }) => (
                <Texts.Medium
                  style={{ color, fontSize: 10, textAlign: 'center' }}>
                  Separação de produtos
                </Texts.Medium>
              ),
              tabBarIcon: ({ color }) => (
                <PackageSearch color={color} size={26} strokeWidth={1.5} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </InternalRequestCartProvider>
  )
}
