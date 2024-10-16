import { SplashScreen } from "expo-router";
import React from "react";
import {
  Text,
  View
} from "react-native";

const Homepage = () => {
  SplashScreen.preventAutoHideAsync();

  return (
    <View className=" flex-1 h-full justify-around px-8 w-full">
      <View className=" w-full px-4 flex flex-col gap-y-4">
        <Text className="text-2xl font-bold text-center">This is homepage</Text>
      </View>
    </View>
  );
};

export default Homepage;
