import { useStorageState } from '@config/useStorageState'
import storageKeys from '@constants/storageKeys'
import HttpClient from '@services/core/HttpClient'
import { createContext, type PropsWithChildren, useCallback } from 'react'

import type { UseAuth } from './index'

const AuthContext = createContext<UseAuth>({
  removeToken: () => null,
  saveToken: () => null,
  session: null,
  isLoading: false,
  removeCode: () => null,
  saveCode: () => null,
  code: null,
})

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState(storageKeys.token)
  const [[isLoadingCode, code], setCode] = useStorageState(storageKeys.code)

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

  const saveCode = useCallback(
    (code: string): void => {
      setCode(code)
    },
    [setCode]
  )

  const removeCode = useCallback((): void => {
    setCode(null)
  }, [setCode])

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
        saveCode,
        removeCode,
        isLoading,
        code,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default SessionProvider
