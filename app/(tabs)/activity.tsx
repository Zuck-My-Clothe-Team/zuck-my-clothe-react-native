import { View, Text } from "react-native";
import React from "react";

const ActivityPage = () => {
  return (
    <View className=" flex-1 h-full justify-around px-8 w-full">
      <View className=" w-full px-4 flex flex-col gap-y-4">
        <Text className="text-2xl font-bold text-center">This is activity page</Text>
      </View>
    </View>
  );
};

export default ActivityPage;
