import { useAuth } from "@/context/auth.context";
import { IUserAuthContext } from "@/interface/userdetail.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, SplashScreen } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profilePic = require("../../assets/images/profilepage/user.png");
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
  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;

  const screenHeight = Dimensions.get("window").height;

  const cardOptionData = [
    {
      title: "แก้ไขข้อมูลส่วนตัว",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
      onpress:() => {
        router.push("/(profile)/edit_profile")
      }
    },
    {
      title: "ที่อยู่",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
      onpress: () => {
        router.push("/(profile)/(address)/address");
      },
    },
    {
      title: "ข้อกำหนดเงื่อนไขและนโยบายอื่น ๆ",
      icon: <AntDesign name="rightcircleo" size={22} color="#71BFFF" />,
    },
    // {
    //   title: "ตั้งค่า",
    //   icon: <Ionicons name="settings-outline" size={22} color="#71BFFF" />,
    // },
    {
      title: "ติดต่อเรา",
      icon: <Feather name="phone" size={22} color="#71BFFF" />,
      onpress: () => {
        router.push("/(profile)/contact")
      }
    },
    {
      title: "ออกจากระบบ",
      icon: <AntDesign name="poweroff" size={22} color="#F0507E" />,
      onpress: async () => {
        await auth?.logout();
      },
      isred: true,
    },
  ];

  return (
    <View className="flex-1 flex-col bg-secondaryblue-200 w-full">
      <View className=" basis-1/4 relative w-full">
        <Image className="w-full" source={profilePageBG} />
      </View>
      <View className="rounded-t-[60px] h-full w-full bg-white relative flex items-center">
        <View className=" absolute -top-16 rounded-full size-32 border-[5px] border-secondaryblue-200 bg-secondaryblue-200 flex">
          <Image
            source={
              userData?.profile_image_url
                ? { uri: userData?.profile_image_url }
                : profilePic
            }
            className="size-full rounded-full"
            resizeMode="cover"
            testID="profile-image"
          />
        </View>
        <View className=" flex flex-col mt-20 w-full gap-y-8 max-h-screen pb-16">
          <View className=" flex flex-col gap-y-4 justify-center items-center">
            <Text className=" text-text-1 font-kanit text-3xl">
              {userData!.firstname}
            </Text>
            <Text className=" text-text-1 font-notoLight text-base">
              {userData!.email}
            </Text>
            <View className=" flex flex-row items-center">
              <FontAwesome6 name="phone" size={22} color="#71BFFF" />
              <Text className=" text-text-4 font-noto text-xl ml-[10px]">
                {userData?.phone || "ไม่พบข้อมูล"}
              </Text>
            </View>
          </View>
          <ScrollView
            className={`${
              screenHeight > 700 ? "" : "h-72"
            } px-3 pb-3 mx-5 -my-2 bg-background-1 rounded-xl flex flex-col gap-y-[9px]`}
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
                  }  font-kanit text-lg`}
                />
              </View>
            ))}
            {screenHeight < 700 && <View className="h-4"></View>}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
