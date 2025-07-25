import Texts from '@components/ui/Texts'
import theme from '@constants/themes'
import type { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  backgroundColor: string
  icon: LucideIcon
  message: string
  textColor: string
  title: string
}

const ToastRoot = ({
  backgroundColor,
  icon: Icon,
  message,
  textColor,
  title,
}: IProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon color={textColor} size={30} strokeWidth={1.5} />
      <View>
        <Texts.Bold style={{ color: textColor, fontSize: 16 }}>
          {title}
        </Texts.Bold>
        <Texts.Regular style={{ color: textColor, fontSize: 14 }}>
          {message}
        </Texts.Regular>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: theme.button.borderRadius,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    marginHorizontal: 16,
  },
})

export default ToastRoot
