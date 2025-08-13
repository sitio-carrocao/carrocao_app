import Button from '@components/ui/Button'
import Texts from '@components/ui/Texts'
import toast from '@components/ui/toast'
import theme from '@constants/themes'
import type { RelativePathString } from 'expo-router'
import { router, useLocalSearchParams } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'

export default function QRCodeCamera() {
  const { path } = useLocalSearchParams<{ path: RelativePathString }>()
  const [isScanning, setIsScanning] = useState<boolean>(true)
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  const camera = useRef<Camera>(null)
  const [isActive, setIsActive] = useState<boolean>(true)

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      for (const code of codes) {
        setIsScanning(false)
        setIsActive(false)
        try {
          const result: {
            column: string
            deposit: string
            id: number
            level: string
          } = JSON.parse(code.value!)
          if (
            !result.column &&
            !result.deposit &&
            !result.id &&
            !result.level
          ) {
            throw new Error()
          }
          router.dismissTo({
            pathname: path,
            params: {
              qrcode: result.id,
            },
          })
          router.setParams({ qrcode: code.value })
        } catch (error) {
          router.back()
          toast.show({
            title: 'ATENÇÃO',
            message: 'QR Code inválido',
            type: 'error',
          })
        }
      }
    },
  })

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          {device && (
            <View style={styles.cameraContainer}>
              <View
                style={[
                  styles.absoluteContainer,
                  styles.verticalContainer,
                  {
                    top: 0,
                  },
                ]}
              />
              <View
                style={[
                  styles.absoluteContainer,
                  styles.horizontalContainer,
                  {
                    left: 0,
                  },
                ]}
              />

              <Camera
                device={device}
                isActive={isActive}
                isMirrored={false}
                ref={camera}
                codeScanner={isScanning ? codeScanner : undefined}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  styles.absoluteContainer,
                  styles.horizontalContainer,
                  {
                    right: 0,
                  },
                ]}
              />
              <View
                style={[
                  styles.absoluteContainer,
                  styles.verticalContainer,
                  {
                    bottom: 0,
                  },
                ]}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.permissionContainer}>
          <LottieView
            autoPlay
            loop
            source={require('../assets/camera.json')}
            style={styles.json}
          />
          <Texts.SemiBold
            style={{ alignSelf: 'center', fontSize: 18, textAlign: 'center' }}>
            O aplicativo requer acesso a câmera
          </Texts.SemiBold>
          <Button
            containerStyle={{ marginTop: 16 }}
            label="Continuar"
            onHandle={requestPermission}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.general,
    justifyContent: 'center',
  },
  permissionContainer: {
    paddingHorizontal: 16,
  },
  json: {
    width: '100%',
    height: '70%',
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  absoluteContainer: {
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: '#000000BF',
  },
  horizontalContainer: {
    width: '15%',
    height: '40%',
    top: '30%',
  },
  verticalContainer: {
    width: '100%',
    height: '30%',
  },
})
