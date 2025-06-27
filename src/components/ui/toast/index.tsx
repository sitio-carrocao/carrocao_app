import React from 'react'

import Toast, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message'

import theme from '@constants/themes'
import { CircleCheck, InfoIcon, OctagonAlert } from 'lucide-react-native'
import ToastRoot from './Root'

interface IShowInputData {
  message: string
  title: string
  type: 'error' | 'info' | 'success'
}

const config: ToastConfig = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: ({ text1, text2 }: ToastConfigParams<any>) => (
    <ToastRoot
      backgroundColor={theme.colors.utils.danger}
      icon={OctagonAlert}
      message={text2 || ''}
      textColor={theme.colors.background.general}
      title={text1 || ''}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  info: ({ text1, text2 }: ToastConfigParams<any>) => (
    <ToastRoot
      backgroundColor={theme.colors.primary.orange}
      icon={InfoIcon}
      message={text2 || ''}
      textColor={theme.colors.background.general}
      title={text1 || ''}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  success: ({ text1, text2 }: ToastConfigParams<any>) => (
    <ToastRoot
      backgroundColor={theme.colors.utils.success}
      icon={CircleCheck}
      message={text2 || ''}
      textColor={theme.colors.background.general}
      title={text1 || ''}
    />
  ),
}

const show = ({ message, title, type }: IShowInputData): void => {
  Toast.show({
    autoHide: true,
    swipeable: true,
    text1: title,
    text2: message,
    type,
    visibilityTime: 2000,
    topOffset: 55,
  })
}

const toast = { config, show }

export default toast
