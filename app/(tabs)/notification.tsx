import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const MessagePage = () => {
  const mockUpNotification = [
    {
      title: "เครื่องอบหมายเลข 2 ทำงานเสร็จแล้ว",
      description: "กรุณานำผ้าออกจากเครื่อง",
      date: "14 ม.ค. 2567 22:34",
    },
    {
      title: "เครื่องอบหมายเลข 2 เริ่มทำงาน",
      description: "โปรดติดตามสถานะผ้าของคุณ",
      date: "14 ม.ค. 2567 22:34",
    },
    {
      title: "เครื่องซักหมายเลข 7 ทำงานเสร็จแล้ว",
      description: "กรุณานำผ้าออกจากเครื่อง",
      date: "14 ม.ค. 2567 22:34",
    },
  ];

  return (
    <SafeAreaView className=" bg-primaryblue-300 flex-1 relative">
      <View className=" w-full relative mt-3 pb-3">
        <View className="">
          <Text className=" text-center font-kanitMedium text-3xl text-background-1 ">
            การแจ้งเตือน
          </Text>
        </View>
        <View className=" px-5 absolute">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={30} color={"#71BFFF"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className=" bg-background-1 h-full px-5">
        <View className=" bg-white mt-4 rounded-2xl">
          {mockUpNotification.map((item, index) => (
            <View
              key={index}
              className={` ${
                index === mockUpNotification.length - 1
                  ? ``
                  : `border-b border-secondaryblue-100`
              }  px-3 py-5 flex flex-col gap-y-1`}
            >
              <Text className=" font-kanit text-lg text-primaryblue-200">
                {item.title}
              </Text>
              <View className=" flex flex-row items-center justify-between">
                <Text className=" font-kanitLight text-base text-secondaryblue-300">
                  {item.description}
                </Text>
                <Text className=" font-kanitLight text-base text-text-4">{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessagePage;
