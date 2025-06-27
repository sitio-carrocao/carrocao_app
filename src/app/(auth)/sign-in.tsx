import React, { useCallback } from 'react'

import { StyleSheet } from 'react-native'

import Containers from '@components/ui/containers'

import Forms from '@components/forms'

export default function SignIn() {
  return (
    <Containers.Keyboard>
      <Containers.Scroll>
        <Forms.SignIn />
      </Containers.Scroll>
    </Containers.Keyboard>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 16,
    marginBottom: 24,
  },

})
