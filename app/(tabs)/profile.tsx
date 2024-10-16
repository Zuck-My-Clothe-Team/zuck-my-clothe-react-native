import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, SplashScreen } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profilePic = require("../../assets/images/profilepage/profilepic.jpg");
const profilePageBG = require("../../assets/images/profilepage/Bubble Bung Bung.png");

interface OptionCardProps {
  title: string;
  icon: React.ReactElement;
  className?: string;
  onPress?: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  icon,
  className,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="w-full bg-white rounded-xl px-[25px] py-[10px] flex flex-row justify-between items-center shadow-blue-small"
      onPress={onPress}
    >
      <Text className={` ${className}`}>{title}</Text>
      <View className="">{icon}</View>
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  SplashScreen.preventAutoHideAsync();

  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(true);

  const screenHeight = Dimensions.get("window").height;

  const profiledata = {
    name: "ParkLuvLaufey03",
    email: "ParkLuvLaufey03@gmail.commmmmm",
    phone_number: "091-119-1191",
  };

  const handleLogout = async () => {
    console.log("User logged out");
    try {
      await AsyncStorage.removeItem("accessToken");
      setAccessToken("");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken !== null && accessToken !== "") {
          setAccessToken(accessToken);
        } else {
          router.replace("/loginpage");
        }
      } catch (error) {
        console.log("Error fetching access token:", error);
      } finally {
        setIsloading(false);
      }
    };
    checkToken();
  }, [accessToken]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const cardOptionData = [
    {
      title: "ข้อมูลส่วนตัว",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
    },
    {
      title: "ที่อยู่",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
    },
    {
      title: "ข้อกำหนดเงื่อนไขและนโยบายอื่น ๆ",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
    },
    {
      title: "ตั้งค่า",
      icon: <Ionicons name="settings-outline" size={22} color="#71BFFF" />,
    },
    {
      title: "ติดต่อ Support",
      icon: <Feather name="phone" size={22} color="#71BFFF" />,
    },
    {
      title: "ออกจากระบบ",
      icon: <AntDesign name="poweroff" size={22} color="#F0507E" />,
      onpress: handleLogout,
      isred: true,
    },
  ];

  return (
    <View className="flex-1 flex-col bg-secondaryblue-200">
      <View className=" basis-1/4 relative">
        <Image className="" source={profilePageBG} />
      </View>
      <View className="rounded-t-[60px] h-full w-full bg-white relative flex items-center">
        <View className=" absolute -top-16 rounded-full size-32 border-[5px] border-secondaryblue-200 bg-secondaryblue-200 flex">
          <Image
            source={profilePic}
            className="size-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <View className=" flex flex-col mt-20 w-full gap-y-8 max-h-screen pb-16">
          <View className=" flex flex-col gap-y-4 justify-center items-center">
            <Text className=" text-text-1 font-noto font-medium text-3xl">
              {profiledata.name}
            </Text>
            <Text className=" text-text-1 font-noto font-light text-base">
              {profiledata.email}
            </Text>
            <View className=" flex flex-row items-center">
              <FontAwesome6 name="phone" size={22} color="#71BFFF" />
              <Text className=" text-text-4 font-noto font-normal text-xl ml-[10px]">
                {profiledata.phone_number}
              </Text>
            </View>
          </View>
          <ScrollView
            className={`${
              screenHeight > 700 ? "" : "h-72"
            } px-3 pb-3 mx-5 bg-background-1 rounded-xl flex flex-col gap-y-[9px]`}
            scrollEnabled={screenHeight > 700 ? false : true}
          >
            {cardOptionData.map((data, index) => (
              <View key={index} className="mt-[9px]">
                <OptionCard
                  key={index}
                  title={data.title}
                  icon={data.icon}
                  onPress={data.onpress}
                  className={` ${
                    data.isred === true
                      ? "text-customred-1"
                      : "text-primaryblue-100"
                  }  font-kanit font-normal text-lg`}
                />
              </View>
            ))}
            {screenHeight < 700 && (<View className="h-4"></View>)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
