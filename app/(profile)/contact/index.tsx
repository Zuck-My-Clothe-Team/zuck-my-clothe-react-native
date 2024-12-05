import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";

const Contact = () => {
  const iconsize = 26;

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
        goto("https://www.facebook.com/WashXpressTH");
      },
    },
    {
      img: <Fontisto name="line" size={iconsize} color="#2594E1" />,
      displayname: "@ZuckMyClothe",
      onpress: () => {
        goto("https://line.me/R/ti/p/@washxpress");
      },
    },
    {
      img: <AntDesign name="mail" size={iconsize} color="#2594E1" />,
      displayname: "support@zuck.co.th",
      onpress: () => {
        goto("mailto:support@zuck.co.th");
      },
    },
    {
      img: <FontAwesome5 name="phone-alt" size={iconsize} color="#2594E1" />,
      displayname: "088-888-8888",
      onpress: () => {
       goto("tel:088-888-8888");
      },
    },
  ];

  return (
    <SafeAreaView className="px-5 flex-1 flex flex-col gap-y-6">
      <View className=" w-full relative mt-3">
        <View className="">
          <Text className=" text-center font-kanitMedium text-3xl text-primaryblue-200">
            ติดต่อเรา
          </Text>
        </View>
        <View className=" absolute bottom-0">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={36} color={"#71BFFF"} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View className="">
          <Image
            source={require("../../../assets/images/profilepage/contactpage/Contact.png")}
            style={{ width: "auto", height: 250 }}
            resizeMode="contain"
          ></Image>
        </View>

        <View className="bg-white border border-customgray-100 rounded-md my-4 p-5">
          <View className=" flex flex-col gap-y-3">
            <View className="border-b border-secondaryblue-100 pb-3 rounded-sm">
              <Text className="font-kanit text-primaryblue-200 text-2xl ">
                บริษัท รับซักผ้าไม่ จำกัด
              </Text>
            </View>
            <Text className="font-kanitLight text-text-4 text-base">
              2105 หมู่ที่ 1 ตำบลคอสโม่ อำเภอเมืองคอสโม่ จ.คอสโม่ 47000
            </Text>
            <View className=" flex flex-col gap-y-3">
              {socialdata.map((social, index) => (
                <View className="p-3" key={index}>
                  <TouchableOpacity onPress={social.onpress}>
                    <View className="flex flex-row gap-x-4">
                      {social.img}
                      <Text className="font-notoSemiBold text-primaryblue-200 text-lg align-middle text-center">
                        {social.displayname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Contact;
