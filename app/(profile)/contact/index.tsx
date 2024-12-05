import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Contact = () => {
  const iconsize = 30;

  const goto = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const socialdata = [
    {
      img: <FontAwesome5 name="facebook" size={iconsize} color="#2594E1" />,
      displayname: "ZuckMyClothe Thailand",
      onpress: () => {
        goto("https://www.facebook.com/");
      },
    },
    {
      img: <Fontisto name="line" size={iconsize} color="#2594E1" />,
      displayname: "@ZuckMyClothe",
      onpress: () => {},
    },
    {
      img: <AntDesign name="mail" size={iconsize} color="#2594E1" />,
      displayname: "zuck_pa@zmc.com",
      onpress: () => {},
    },
    {
      img: <FontAwesome5 name="phone-alt" size={iconsize} color="#2594E1" />,
      displayname: "088-888-8888",
      onpress: () => {},
    },
  ];

  return (
    <View>
      <SafeAreaView className="px-5">
        <View className="h-28 relative">
          <TouchableOpacity
            className="absolute pt-5 z-10"
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={48} color="#71BFFF" />
          </TouchableOpacity>
          <View className="absolute w-full h-full flex items-center justify-center">
            <Text className="text-4xl p-1 font-kanitMedium text-primaryblue-200 align-middle">
              ติดต่อเรา
            </Text>
          </View>
        </View>

        <View className="">
          <Image
            source={require("../../../assets/images/profilepage/contactpage/Contact.png")}
            style={{ width: "auto", height: 300 }}
            resizeMode="contain"
          ></Image>
        </View>

        <View className="bg-white border border-customgray-100 rounded-md my-4 p-4">
          <View className="">
            <Text className="font-kanit text-primaryblue-200 text-3xl mb-2 pb-2 border-b border-b-secondaryblue-100">
              บริษัท ซัก มาย โคลท จำกัด
            </Text>
            <Text className="font-kanitLight text-text-4 text-xl">
              2105 หมู่ที่ 1 ตำบลคอสโม่ อำเภอเมืองคอสโม่ จ.คอสโม่ 47000
            </Text>
          </View>

          {socialdata.map((social, index) => (
            <View className="p-3 my-1" key={index}>
              <TouchableOpacity onPress={social.onpress}>
                <View className="flex flex-row gap-4">
                  {social.img}
                  <Text className="font-notoSemiBold text-primaryblue-200 text-xl align-middle text-center">
                    {social.displayname}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Contact;
