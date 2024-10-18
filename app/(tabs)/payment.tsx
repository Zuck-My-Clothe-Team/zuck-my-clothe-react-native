import { View, Text } from "react-native";
import React from "react";

const PaymentPage = () => {
  return (
    <View className=" flex-1 h-full justify-around px-8 w-full">
      <View className=" w-full px-4 flex flex-col gap-y-4">
        <Text className="text-2xl font-notoBold text-center">
          This is payment page
        </Text>
      </View>
    </View>
  );
};

export default PaymentPage;
