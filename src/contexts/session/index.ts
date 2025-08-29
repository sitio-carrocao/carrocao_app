import { use } from 'react'

import { AuthContext } from './provider'

interface IUseAuth {
  session: string | null
  removeToken(): void
  saveToken(string: string): void
  removeCode(): void
  saveCode(code: string): void
  isLoading: boolean
  code: string | null
}

function useSession(): IUseAuth {
  const value = use(AuthContext)
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />')
  }

  return value
}

export type { IUseAuth as UseAuth }
export default useSession
