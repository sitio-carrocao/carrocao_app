import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
  id: 'carrocao-storage',
  encryptionKey: 'EncrypTedKey123',
})
