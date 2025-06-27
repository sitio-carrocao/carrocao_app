import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
} from 'react'

import storageKeys from '@constants/storageKeys'

import { useStorageState } from '@config/useStorageState'
import HttpClient from '@services/core/HttpClient'
import type { UseAuth } from './index'

const AuthContext = createContext<UseAuth>({
  removeToken: () => null,
  saveToken: () => null,
  session: null,
  isLoading: false,
})

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState(storageKeys.token)

  if (session) {
    HttpClient.setBearerToken(session)
  }

  const saveToken = useCallback(
    (token: string): void => {
      setSession(token)
      HttpClient.setBearerToken(token)
    },
    [setSession]
  )

  const removeToken = useCallback((): void => {
    setSession(null)
    HttpClient.removeBearerToken()
  }, [setSession])

  return (
    <AuthContext.Provider
      value={{
        session,
        saveToken,
        removeToken,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default SessionProvider
