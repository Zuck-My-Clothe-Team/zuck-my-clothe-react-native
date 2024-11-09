import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

const OrderSummary = () => {
  return (
    <View className=' flex-1 h-full justify-around'>
      <Text className=''> OrderSummary </Text>
      <TouchableOpacity className=' p-4 bg-primaryblue-100' onPress={() => router.back()}>
        <Text className=' text-white'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default OrderSummary