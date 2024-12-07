import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const pay_complete = () => {
  return (
    <View className="px-7 h-full bg-primaryblue-200">
      <SafeAreaView className="h-full">
        <TouchableOpacity
          className="pt-5"
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={48} color="#F9FAFF" />
        </TouchableOpacity>
        <View className="my-[30%] w-full items-center">
          <Ionicons name="checkmark-circle" size={200} color="#F9FAFF" />
        </View>

        <View className="">
          <Text className="font-kanitMedium text-4xl text-text-2 py-2 ">
            ชำระเงินเสร็จสิ้น
          </Text>
          <Text className="font-kanit text-lg text-secondaryblue-100">
            โปรดกดปุ่มเริ่มทำงานบนเครื่องซักเพื่อเริ่มการทำงานและเก็บผ้าของคุณออกจากเครื่องเมื่อซักเสร็จ
          </Text>
        </View>

        <View className="justify-evenly absolute inset-x-0 bottom-4 h-48">
          <TouchableOpacity
            onPress={() => {
              router.back();
              router.back();
            }}
          >
            <View className="border border-white items-center px-7 py-3 w-full rounded">
              <Text className="text-text-2 font-kanit text-xl">
                ใช้งานเครื่องซักผ้าต่อไป
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.back();
              router.back();
              router.back();
            }}
          >
            <View className="bg-text-2 items-center px-7 py-3 bottom-0 w-full rounded">
              <Text className="text-xl font-kanit text-primaryblue-200">
                กลับสู่หน้าหลัก
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default pay_complete;
