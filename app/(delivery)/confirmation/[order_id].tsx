import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderConfirmationPage = () => {
  const navigation = useNavigation();

  const MockUpData = [
    {
      id: 1,
      type: "เครื่องซัก",
      weight: 7,
      price: 100,
      amount: 2,
    },
    {
      id: 2,
      type: "เครื่องอบ",
      weight: 14,
      price: 100,
      amount: 1,
    },
    {
      id: 3,
      type: "น้ำยาซักผ้า - ปรับผ้านุ่ม",
      price: 20,
      desc: "น้ำยาเกรดพรีเมี่ยม หอมยาวนาน",
      amount: 1,
    },
  ];

  const deliveryFee = 40;
  const subtotal = MockUpData.reduce((acc, item) => {
    return acc + item.price * item.amount;
  }, 0);
  const total = subtotal + deliveryFee;

  // useEffect(() => {
  //   navigation.addListener("beforeRemove", (e) => {
  //     e.preventDefault();
  //     console.log("onback");
  //     // Do your stuff here
  //     navigation.dispatch(e.data.action);
  //   });
  // }, [navigation]);

  return (
    <SafeAreaView className=" bg-background-1 flex-1" edges={["top"]}>
      <KeyboardAwareScrollView
        // enableOnAndroid={true}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="always"
        // keyboardVerticalOffset={100}
      >
        <View className=" w-full relative mt-3">
          <View className="">
            <Text className=" text-center font-kanitMedium text-3xl text-primaryblue-200">
              ยืนยันรายการ
            </Text>
          </View>
          <View className=" px-6 absolute">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={30} color={"#2594e1"} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className=" " showsVerticalScrollIndicator={false}>
          {/* Address Card */}
          <View className="px-5">
            <View className=" mt-4 px-5 py-8 rounded-xl bg-white border border-customgray-100">
              <View className=" flex flex-row justify-between">
                <Text className=" font-kanit text-2xl text-primaryblue-200">
                  ที่อยู่รับส่ง
                </Text>
              </View>
              <View className=" mt-2 flex flex-row gap-x-4">
                <View className=" flex justify-center items-center">
                  <MaterialIcons
                    name="location-pin"
                    size={24}
                    color="#0285df"
                  />
                </View>
                <View className=" w-full flex flex-row flex-1 pr-4">
                  <Text className=" font-kanitLight text-base">
                    S7 Building 126 Parachauthid Rd. Bangmod Thungkru Bangkok
                    10140
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Branch Card */}
          <View className=" px-5">
            <View className=" mt-5 gap-y-2 flex flex-col px-5 py-3 rounded-xl bg-white border border-customgray-100">
              <View className="flex flex-col gap-y-2">
                <Text className="font-kanitLight text-base text-primaryblue-200">
                  ให้บริการโดย
                </Text>
                <View className=" flex flex-row gap-x-4 justify-start items-center">
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={{ width: 24, aspectRatio: 1 }}
                  />
                  <Text className=" font-kanitLight flex-1">
                    ZMC สาขา สุขุมวิท 101
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Card */}
          <View className="px-5">
            <View className=" mt-4 px-5 py-5 rounded-xl bg-white border border-customgray-100">
              <Text className=" flex-1 font-kanit text-primaryblue-200 text-2xl">
                รายการทั้งหมด
              </Text>
              <View className=" flex flex-col">
                {MockUpData.map((item, index) => (
                  <View
                    key={item.id}
                    className={` flex flex-row justify-between ${
                      index < MockUpData.length - 1 ? "border-b" : ""
                    } border-customgray-100 py-4`}
                  >
                    <View className=" flex flex-row gap-x-4 items-center">
                      <View className=" flex justify-center items-center bg-yellowaccent-100 size-8 rounded-full">
                        <Text className=" font-noto text-base text-text-4">
                          {item.amount}
                        </Text>
                      </View>
                      <View className=" flex- flex-col">
                        <Text className=" font-kanit text-lg text-text-1">
                          {item.type}{" "}
                        </Text>
                        <Text className=" font-kanitLight text-base text-text-4">
                          {item.weight ? `ขนาด ${item.weight} กิโลกรัม` : ""}
                          {item.desc ? item.desc : ""}
                        </Text>
                      </View>
                    </View>

                    <View className=" flex items-center justify-center">
                      <Text className=" font-kanit text-xl text-text-4">
                        {item.price}฿
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          {/* Summary Card */}
          <View className=" mt-4 px-5 py-5 bg-white border border-customgray-100">
            <Text className=" font-kanit text-xl text-text-1 mb-2">
              สรุปราคา
            </Text>
            <View className=" flex flex-col gap-y-1">
              <View className=" flex flex-row justify-between">
                <Text className=" font-kanitLight text-base text-text-4">
                  ค่าบริการ
                </Text>
                <Text className=" font-kanitLight text-base text-text-4">
                  {MockUpData.reduce((acc, item) => {
                    return acc + item.price * item.amount;
                  }, 0)}
                  ฿
                </Text>
              </View>
              <View className=" flex flex-row justify-between">
                <Text className=" font-kanitLight text-base text-text-4">
                  ค่าบริการรับ-ส่งผ้า
                </Text>
                <Text className=" font-kanitLight text-base text-text-4">
                  {deliveryFee}฿
                </Text>
              </View>

              <View className=" flex flex-row justify-between">
                <Text className=" font-kanitLight text-base text-text-4">
                  ราคารวม
                </Text>
                <Text className=" font-kanitLight text-base text-text-4">
                  {total}฿
                </Text>
              </View>
            </View>
          </View>

          {/* Note */}
          <View className=" my-4 px-5 py-5 bg-white border border-customgray-100 flex flex-row items-start gap-x-4">
            <Text className=" font-kanit text-xl text-primaryblue-200 mt-1">
              Note :{" "}
            </Text>
            <TextInput
              className=" flex-1 font-kanitLight text-base text-text-4"
              placeholder="กรอกโน้ตถึงร้านซักผ้า"
              multiline={true}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Total Card */}
      <View className="">
        <View className="px-5 py-5 bg-white border border-customgray-100">
          <View className=" flex flex-row justify-between">
            <Text className=" font-kanit text-xl text-primaryblue-200">
              ราคารวม
            </Text>
            <Text className=" font-kanit text-xl text-primaryblue-200">
              {total}฿
            </Text>
          </View>
          <TouchableOpacity
            className=" mt-3 w-full bg-primaryblue-200 rounded-lg py-3 mb-3"
            onPress={() => {
              router.replace("/(delivery)/confirmation/paymentcomplete");
            }}
          >
            <View>
              <Text className=" font-kanit text-lg text-text-2 text-center">
                ชำระเงิน
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirmationPage;
