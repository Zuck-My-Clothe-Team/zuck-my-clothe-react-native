import React from 'react'
import { Stack } from 'expo-router'

const OrderSummaryLayout = () => {
  return (
    <Stack screenOptions={{}}>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='pay_complete' options={{headerShown:false}}/>
    </Stack>
  )
}

export default OrderSummaryLayout