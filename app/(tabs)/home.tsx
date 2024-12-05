import { getMachineDetailBySerial } from "@/api/machine.api";
import { getFullOrderByUserID } from "@/api/order.api";
import { useAuth } from "@/context/auth.context";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import { IOrder, OrderStatus } from "@/interface/order.interface";
import { IUserAuthContext } from "@/interface/userdetail.interface";
import { DateFormatter } from "@/utils/datetime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { router, SplashScreen } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

interface OptionCardProps {
  zuckNumber: string;
  zuckRemain: string;
}

// eslint-disable-next-line react/display-name
const OptionCard: React.FC<OptionCardProps> = memo(
  ({ zuckNumber, zuckRemain }) => {
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
  }
);

const Homepage = () => {
  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;
  const profilePic = require("../../assets/images/profilepage/user.png");

  const itemstyle = "w-20 h-28 flex flex-col";
  const upperitemstyle = "h-[70%] items-center justify-center";
  const loweritemstyle = "justify-center items-center";
  const textitemstyle = "font-kanitLight text-base text-text-1 text-center";

  const [isWashing, setIsWashing] = useState(false);
  const [isSnap, setIsSnap] = useState(0);
  const [machineData, setMachineData] = useState<{
    [key: string]: {
      machine_serial: string;
      machine_label: string;
    };
  }>({});

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

  interface actionButtonProps {
    name: string;
    img_url: any;
    onpress?: () => void;
    width: number;
  }

  const actionbutton: actionButtonProps[] = [
    {
      name: "ค้นหาร้าน",
      img_url: require("../../assets/images/mainpage/location.png"),
      onpress: () => {
        router.push("/searchbranch");
      },
      width: 37,
    },
    {
      name: "รับ-ส่งผ้า",
      img_url: require("../../assets/images/mainpage/wash-send.png"),
      onpress: () => {
        router.push("/delivery");
      },
      width: 44,
    },
    {
      name: "รายงาน",
      img_url: require("../../assets/images/mainpage/report.png"),
      onpress: () => {
        router.push("/(report)/scanner");
      },
      width: 44,
    },
    {
      name: "ช่วยเหลือ",
      img_url: require("../../assets/images/mainpage/support.png"),
      onpress: () => {
        Linking.openURL("tel:0812345678");
      },
      width: 60,
    },
  ];

  const [order, setOrder] = useState<IOrder[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchOrder() {
        try {
          const order = await getFullOrderByUserID(OrderStatus.Processing);
          const filteredOrder = order.filter((data) =>
            data.order_details.some(
              (detail) =>
                new Date(detail.finished_at).getTime() - Date.now() > 0 &&
                detail.order_status === OrderStatus.Processing &&
                detail.machine_serial !== null &&
                detail.machine_serial !== ""
            )
          );
          filteredOrder.sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });

          const machineData: {
            [key: string]: {
              machine_serial: string;
              machine_label: string;
            };
          } = {};

          await Promise.all(
            filteredOrder.map((data) =>
              Promise.all(
                data.order_details.map(async (detail) => {
                  if (machineData[detail.machine_serial] === undefined) {
                    const machine: IMachineInBranch =
                      await getMachineDetailBySerial(detail.machine_serial);
                    machineData[machine.machine_serial] = {
                      machine_serial: machine.machine_serial,
                      machine_label: machine.machine_label,
                    };
                  }
                })
              )
            )
          );

          setMachineData(machineData);
          setOrder(filteredOrder);
        } catch (error) {
          console.log(error);
        }
      }
      fetchOrder();
    }, [])
  );

  useEffect(() => {
    if (order && order.length > 0) {
      setIsWashing(true);
      // console.log('Created order finished at :' + new Date(order[0].created_at));
      // const finishedTime = new Date(order[0].order_details[0].finished_at);
      // const currentTime = new Date();
      // console.log('Finished time: ' + finishedTime);
    }
  }, [order]);

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
              onPress={item.onpress}
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

        {isWashing && order && (
          <View className="mx-6 py-8">
            <Text className="font-kanitMedium text-text-3 text-4xl py-4">
              สถานะเครื่องซักผ้า
            </Text>

            <View className="w-full flex flex-row">
              <ScrollView horizontal={true}>
                <View className="flex flex-row">
                  {order.map((data) =>
                    data.order_details.map((detail, index) => {
                      const machine = machineData[detail.machine_serial];
                      if (!machine) {
                        return null;
                      }

                      return (
                        <OptionCard
                          key={index}
                          zuckNumber={
                            machineData[detail.machine_serial].machine_label
                          }
                          zuckRemain={DateFormatter.getTimeRemaining(
                            new Date(detail.finished_at)
                          )}
                        />
                      );
                    })
                  )}
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
