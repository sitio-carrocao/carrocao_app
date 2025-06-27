import { useCallback, useEffect, useReducer } from 'react'
import { storage } from './storage'

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void]

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>
}

export async function setStorageItem(key: string, value: string | null) {
  if (value == null) {
    storage.delete(key)
  } else {
    storage.set(key, value)
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>()

  // Get
  useEffect(() => {
    const value = storage.getString(key)
    if (value) {
      setState(value)
    }
  }, [key, setState])

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value)
      setStorageItem(key, value)
    },
    [key, setState]
  )

  return [state, setValue]
}
