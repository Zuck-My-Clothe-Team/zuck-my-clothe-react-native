import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";

const OrderSummary = () => {
  const { data } = useLocalSearchParams();

  const mockUpMachineData = {
    location: "ประชาอุทิศ 45",
    zuckNumber: data,
    size: 14,
    price: 110,
  };

  return (
    <View>
      <SafeAreaView className=" h-full px-9">
        <View className=" h-full">
          <View className="">
            <View className="">
              <TouchableOpacity
                className="pt-5"
                onPress={() => {
                  router.back();
                }}
              >
                <AntDesign name="arrowleft" size={48} color="#696969" />
              </TouchableOpacity>
            </View>

            <View className="pt-[20%]">
              <Text className="font-kanitMedium text-4xl text-text-3 mb-2">
                สรุปรายการ
              </Text>
              <Text className="font-kanit text-2xl text-text-4">
                โปรดตรวจสอบรายการก่อนทำการชำระเงิน
              </Text>
            </View>
          </View>

          <View className=" items-center bg-white rounded-xl border-2 border-customgray-200 mt-[20%] p-8">
            <View className="mb-3">
              <Text className="text-primaryblue-200 font-kanitMedium text-3xl">
                ZMC {mockUpMachineData.location}
              </Text>
            </View>

            <View className="flex flex-row mb-12">
              <View className="flex-1">
                <View>
                  <Text className="text-text-1 font-kanit text-xl">
                    เครื่องซักหมายเลข {mockUpMachineData.zuckNumber}
                  </Text>
                </View>
                <View>
                  <Text className="text-text-4 font-kanitLight text-sm">
                    ขนาด 14 กิโล
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-text-4 font-kanit text-xl">
                  {mockUpMachineData.price}฿
                </Text>
              </View>
            </View>

            <View className="">
              <Image
                style={{ height: 128 }}
                resizeMode="contain"
                source={require("../../assets/images/order_summarypage/wash.png")}
              ></Image>
            </View>
          </View>

          <View className="absolute inset-x-0 bottom-0">
            <View className="flex flex-row w-full justify-between">
              <Text className="font-kanitMedium text-text-3 text-3xl">รวม</Text>
              <Text className="font-kanitMedium text-text-3 text-3xl">
                {mockUpMachineData.price} ฿
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/order_summary/pay_complete")}
              className="w-full rounded-lg bg-primaryblue-200 items-center px-20 py-2 mt-5 mb-14"
            >
              <Text className="font-kanit text-lg text-text-2">
                ชำระเงินผ่าน mobile banking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OrderSummary;
