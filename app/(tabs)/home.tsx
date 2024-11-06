import { useAuth } from "@/context/auth.context";
import { IUserAuthContext } from "@/interface/userdetail.interface";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, SplashScreen } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Homepage = () => {
  SplashScreen.preventAutoHideAsync();
  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;
  return (
    <SafeAreaView className=" w-full justify-center flex flex-col items-center bg-primaryblue-300">
      <View className=" w-full bg-primaryblue-300 flex flex-row py-5 px-6">
        <View className="w-auto flex">
          <Text className="font-kanitMedium text-white text-3xl pt-1">
            สวัสดี คุณ {userData?.firstname}
          </Text>
          <View className="flex flex-row">
            <FontAwesome5
              className="mr-2"
              name="map-marker-alt"
              size={21}
              color="white"
            />
            <Text className="font-kanit text-white text-lg">
              Bangkok Thung Kru
            </Text>
          </View>
        </View>
        <View className="items-end justify-center flex flex-grow">
          <View className="size-20 bg-slate-300 rounded-full"></View>
        </View>
      </View>

      <ScrollView className=" h-full w-full bg-white flex flex-col">
        <View className=" flex justify-center items-center w-full h-full py-8">
          <TouchableOpacity className=" p-5 bg-customred-1 rounded-large" onPress={() => {router.push("/searchbranch")}}>
            <Text className=" font-kanitMedium text-2xl text-white">ค้นหาสาขา</Text>
          </TouchableOpacity>
        </View>
        <View className=""></View>
        <View className=""></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homepage;
