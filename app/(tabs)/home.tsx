import { useAuth } from "@/context/auth.context";
import { IUserAuthContext } from "@/interface/userdetail.interface";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router, SplashScreen, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

interface OptionCardProps {
  zuckNumber: number;
  zuckRemain: number;
}

const OptionCard: React.FC<OptionCardProps> = ({ zuckNumber, zuckRemain }) => {
  return (
    <View className="w-72 pl-2 rounded-xl px-5 py-3">
      <View className=" flex flex-col">
        <View className=" flex flex-row items-center">
          <Text className="w-[40%] font-kanit text-2xl text-text-3">
            เครื่องซัก
          </Text>
          <Text className="font-kanitLight  text-text-4">
            หมายเลข {zuckNumber}
          </Text>
        </View>

        <View className="flex flex-row items-center py-2">
          <View className="justify-center w-[30%] flex flex-row">
            <Image
              source={require("../../assets/images/mainpage/report.png")}
              style={{ width: 40, height: 42 }}
            />
          </View>
          <View className="w-[10%] items-center">
            <View className="w-[1px] h-7 rounded-sm bg-blue-400"></View>
          </View>

          <View className="">
            <Text className="font-kanit text-xl text-text-4">
              เสร็จในอีก {zuckRemain} นาที
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Homepage = () => {
  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;
  const profilePic = require("../../assets/images/profilepage/user.png");

  const itemstyle = "w-20 h-28 flex flex-col";
  const upperitemstyle = "h-[70%] items-center justify-center";
  const loweritemstyle = "justify-center items-center";
  const textitemstyle = "font-kanitLight text-base text-text-1";

  // const width = Dimensions.get("window").width;

  const [isWashing, setIsWashing] = useState(true);
  const [isSnap, setIsSnap] = useState(0);

  const promotionPic = [
    {
      number: 1,
      Image: require("../../assets/images/mainpage/promotion1.png"),
    },
  ];

  const carouselPic = [
    { number: 1, image: require("@/assets/images/mainpage/heropic3.png") },
    { number: 2, image: require("@/assets/images/mainpage/heropic2.png") },
    { number: 3, image: require("@/assets/images/mainpage/heropic1.png") },
  ];

  const mockUpZuckMachineData = [
    { number: 1, minute: 24 },
    { number: 1, minute: 24 },
    { number: 1, minute: 24 },
  ];

  interface actionButtonProps {
    name: string;
    img_url: any;
    path: Href<string>;
    width: number;
  }

  const actionbutton: actionButtonProps[] = [
    {
      name: "ค้นหาร้าน",
      img_url: require("../../assets/images/mainpage/location.png"),
      path: "/searchbranch",
      width: 37,
    },
    {
      name: "รับ-ส่งผ้า",
      img_url: require("../../assets/images/mainpage/wash-send.png"),
      path: "/delivery",
      width: 44,
    },
    {
      name: "รายงาน",
      img_url: require("../../assets/images/mainpage/report.png"),
      path: "/(report)/scanner",
      width: 44,
    },
    {
      name: "รีวิว",
      img_url: require("../../assets/images/mainpage/review.png"),
      path: "/history",
      width: 55,
    },
  ];

  return (
    <SafeAreaView className="h-full w-full flex flex-col bg-primaryblue-300">
      <View className="w-full flex flex-row bg-primaryblue-300 px-6 py-2">
        <View className="flex flex-col py-5">
          <Text className="font-kanitMedium text-white text-3xl py-1">
            สวัสดี คุณ {userData?.firstname}
          </Text>
          <View className="flex flex-row">
            <Ionicons
              className="mr-2"
              name="location"
              size={24}
              color="#F9FAFF"
            />
            <Text className="font-kanit text-white text-xl">
              Bangkok, Thung kru
            </Text>
          </View>
        </View>
        <View className="flex flex-grow justify-center items-end">
          <View className="w-[4.5rem] h-[4.5rem] bg-white rounded-full">
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
        </View>
      </View>

      <ScrollView
        className="w-full h-full bg-white flex flex-col"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-3 justify-center items-center relative ">
          <Carousel
            loop
            width={Dimensions.get("window").width - 30}
            height={170}
            autoPlay={true}
            data={carouselPic}
            autoPlayInterval={4000}
            scrollAnimationDuration={2000}
            onSnapToItem={(item) => {
              setIsSnap(item);
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
                {/* <Text style={{ textAlign: "center", fontSize: 30 }}>
                  {item.number}
                </Text> */}
              </View>
            )}
          />

          {/* carousel dot */}
          <View className=" w-full justify-center gap-2 flex flex-row py-4 absolute bottom-0">
            {carouselPic.map((index, item) => (
              <View
                key={item}
                className={` size-3 rounded-full border border-customgray-400 ${
                  isSnap === item ? `bg-secondaryblue-200` : `bg-customgray-200`
                } justify-center items-center`}
              ></View>
            ))}
          </View>
        </View>

        <View className="flex flex-row gap-8 py-3 h-32 my-3 justify-center">
          {actionbutton.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={itemstyle}
              onPress={() => {
                router.push(item.path);
              }}
            >
              <View className={upperitemstyle}>
                <Image
                  style={{ width: item.width }}
                  resizeMode="contain"
                  source={item.img_url}
                />
              </View>
              <View className={loweritemstyle}>
                <Text className={textitemstyle}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {isWashing && (
          <View className="mx-6 py-8">
            <Text className="font-kanitMedium text-text-3 text-4xl py-4">
              สถานะเครื่องซักผ้า
            </Text>

            <View className="w-full flex flex-row">
              <ScrollView horizontal={true}>
                <View className="flex flex-row">
                  {mockUpZuckMachineData.map((data, index) => (
                    <OptionCard
                      key={index}
                      zuckNumber={data.number}
                      zuckRemain={data.minute}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        <View className="flex flex-col">
          <Text className=" px-6 font-kanitMedium text-text-3 text-4xl py-4">
            โปรโมชั่นและสิทธิพิเศษ
          </Text>
          <View className=" mb-[8.5rem]">
            <Image
              source={promotionPic[0].Image}
              style={{ width: Dimensions.get("window").width, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homepage;
