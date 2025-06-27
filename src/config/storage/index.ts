import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
  id: 'guicheweb-storage',
  encryptionKey: 'EncrypTedKey123',
})
