import theme from '@constants/themes'
import { ImageZoom } from '@likashefqet/react-native-image-zoom'
import { useLocalSearchParams } from 'expo-router'
import { Image, StyleSheet, View } from 'react-native'

export default function TabExternalRequestImage() {
  const params = useLocalSearchParams<{ uri: string }>()

  return (
    <View style={styles.container}>
      <ImageZoom
        isDoubleTapEnabled
        style={styles.image}
        resizeMode="center"
        source={{
          uri: params.uri,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
