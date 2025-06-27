import React from 'react'

import { StyleSheet, View } from 'react-native'

import type { Icon as IconBase } from 'phosphor-react-native'

import Texts from '@components/ui/Texts'

import theme from '@constants/themes'

interface IProps {
  backgroundColor: string
  icon: IconBase
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
      <Icon color={textColor} size={30} weight="bold" />
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
    width: '90%',
  },
})

export default ToastRoot
