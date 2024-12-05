import { getMachineDetailBySerial } from "@/api/machine.api";
import { getOrderByOrderHeaderId } from "@/api/order.api";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import {
  IOrder,
  IOrderDetail,
  ServiceType,
  ServiceTypeTH,
} from "@/interface/order.interface";
import { DateFormatter } from "@/utils/datetime";
import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IOrderDetailWithLabel extends IOrderDetail {
  machine_label?: string | null; // Extend IOrderDetail to include machine_label
}

const MachineStatus = () => {
  const [fullOrder, setFullOrder] = useState<IOrder>();
  const [orderDetails, setOrderDetails] = useState<IOrderDetailWithLabel[]>([]);
  const { order_header_id } = useLocalSearchParams();

  const loadDataFromDb = async (headerId: string | string[]) => {
    try {
      const fullOrderData = await getOrderByOrderHeaderId(headerId as string);
      setFullOrder(fullOrderData.data);
    } catch (error) {
      console.log("Error fetching order by order_header_id", error);
    }
  };

  const extractNumbers = (label: string | null): string | null => {
    if (!label) return null;
    const numbers = label.match(/\d+/g); // Extract all numeric sequences
    return numbers ? numbers.join("") : null; // Join them into a single string
  };

  const filterOrderDetail = async (fullOrder: IOrder | undefined) => {
    if (!fullOrder) return;
    const washDryOrderDetails = fullOrder.order_details.filter((detail) => {
      return (
        (detail.service_type === ServiceType.Washing ||
          detail.service_type === ServiceType.Drying) &&
        detail.finished_at !== null
      );
    });

    const detailsWithLabels = await Promise.all(
      washDryOrderDetails.map(async (detail) => {
        try {
          if (detail.machine_serial === null) {
            return { ...detail, machine_label: null };
          }
          const machine: IMachineInBranch = await getMachineDetailBySerial(
            detail.machine_serial
          );
          return { ...detail, machine_label: extractNumbers(machine.machine_label) };
        } catch (error) {
          console.error("Error fetching machine detail:", error);
          return { ...detail, machine_label: null };
        }
      })
    );

    setOrderDetails(detailsWithLabels);
  };

  useFocusEffect(
    useCallback(() => {
      loadDataFromDb(order_header_id);
    }, [order_header_id])
  );

  useEffect(() => {
    filterOrderDetail(fullOrder);
  }, [fullOrder]);

  return (
    <View className="bg-background-1 h-full">
      <SafeAreaView className="h-full">
        <View style={styles.headerBg}>
          <AntDesign
            name="arrowleft"
            size={24}
            style={{ position: "absolute", left: 10, zIndex: 10 }}
            color="#71BFFF"
            onPress={() => {
              router.back();
            }}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>การทำงาน</Text>
          </View>
        </View>
        <View className="mx-8 gap-4">
          {orderDetails?.length > 0 ? (
            orderDetails?.map((detail, index) => (
              <View
                key={index}
                className="px-5 py-4 flex flex-col gap-2 border border-secondaryblue-100 rounded-lg"
              >
                <View className="flex flex-row">
                  <Text className="text-text-3 font-kanit text-2xl w-[30%]">
                    {ServiceTypeTH[detail.service_type]}
                  </Text>
                  <Text className="text-text-4 font-kanitLight text-lg">
                    หมายเลข {detail.machine_label || "-"}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <View className="w-[30%]">
                    <Image
                      source={require("../../assets/images/historypage/Washing.png")}
                      resizeMode="contain"
                      className="w-20 h-16"
                    ></Image>
                  </View>
                  <View className="bg-secondaryblue-300 w-1"></View>
                  <View className="justify-center w-[69%] items-center">
                    <Text className="text-text-4 font-kanit text-xl align-middle mr-12">
                      {detail.finished_at
                        ? new Date(detail.finished_at) - Date.now() > 0
                          ? `เสร็จในอีก ${DateFormatter.getTimeDifferenceStatus(
                              new Date(detail.finished_at)
                            )}`
                          : "เสร็จแล้ว"
                        : "ไม่มีข้อมูล"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="my-10 font-kanit text-text-4 text-2xl align-middle text-center">
              ยังไม่มีผ้าที่กำลังซักในขณะนี้
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MachineStatus;

const styles = StyleSheet.create({
  background: {
    height: "100%",
  },
  headerBg: {
    position: "relative",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#2594E1",
    fontSize: 28,
    fontWeight: 500,
    fontFamily: "Kanit_500Medium",
    fontStyle: "normal",
  },
});
