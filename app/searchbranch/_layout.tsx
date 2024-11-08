import React from 'react'
import { Stack } from 'expo-router'

const BranchLayout = () => {
  return (
    <Stack screenOptions={{}}>
        <Stack.Screen name='index' options={{headerShown:false}}/>
    </Stack>
  )
}

export default BranchLayout