import { getBranchByID } from "@/api/branch.api";
import { getOrderByOrderHeaderId } from "@/api/order.api";
import { UpdatePayment } from "@/api/payment.api";
import OrderDetailCard from "@/components/order/orderDetailCard";
import { IBranch } from "@/interface/branch.interface";
import { MachinePrice } from "@/interface/machinebranch.interface";
import { IOrder, ServiceType } from "@/interface/order.interface";
import { EPaymentStatus, IPaymentUpdate } from "@/interface/payment.interface";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderConfirmationPage = () => {
  const { order_id } = useLocalSearchParams<{ order_id: string }>();
  const [orderData, setOrderData] = React.useState<IOrder>();
  const [branchData, setBranchData] = React.useState<IBranch>();

  const fetchBranchData = useCallback(async (branch_id: string) => {
    try {
      const data = await getBranchByID(branch_id);
      setBranchData(data);
    } catch (error) {
      console.error("Error during fetch branch by branch_id:", error);
    }
  }, []);

  const fetchOrder = useCallback(
    async (order_id: string) => {
      try {
        const data = await getOrderByOrderHeaderId(order_id, "full");
        if (!data) return;
        setOrderData(data);
        await fetchBranchData(data.branch_id);
      } catch (error) {
        console.error("Error during fetch order by order_id:", error);
      }
    },
    [fetchBranchData]
  );

  useMemo(async () => {
    await fetchOrder(order_id);
  }, [fetchOrder, order_id]);

  useEffect(() => {
    console.log("order detail:", orderData?.order_details);
  }, [branchData, orderData]);

  const subtotal =
    orderData?.order_details?.reduce((acc, item) => {
      if (
        item.service_type === ServiceType?.Washing ||
        item.service_type === ServiceType?.Drying
      ) {
        return acc + MachinePrice[item.weight];
      } else if (item.service_type === ServiceType?.Agents) {
        return acc + 20;
      }
      return acc;
    }, 0) ?? 0;

  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView className=" bg-background-1 flex-1" edges={["top"]}>
      {/* <View></View> */}
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

      <ScrollView className=" mt-4" showsVerticalScrollIndicator={false}>
        <View className=" px-5 flex flex-col gap-y-4">
          {/* Address Card */}
          <View className="">
            <View className=" px-5 py-8 rounded-xl bg-white border border-customgray-100">
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
                    {orderData?.delivery_address}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Branch Card */}
          <View className="">
            <View className=" gap-y-2 flex flex-col px-5 py-3 rounded-xl bg-white border border-customgray-100">
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
                    สาขา {branchData?.branch_name}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Card */}
          <View className="">
            <OrderDetailCard orderDetail={orderData?.order_details} />
          </View>
        </View>

        {/* Summary Card */}
        <View className=" mt-4 px-5 py-5 bg-white border border-customgray-100">
          <Text className=" font-kanit text-xl text-text-1 mb-2">สรุปราคา</Text>
          <View className=" flex flex-col gap-y-1">
            <View className=" flex flex-row justify-between">
              <Text className=" font-kanitLight text-base text-text-4">
                ค่าบริการ
              </Text>
              <Text className=" font-kanitLight text-base text-text-4">
                {subtotal}฿
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
      </ScrollView>

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
            onPress={async () => {
              if (orderData) {
                const payment_detail: IPaymentUpdate = {
                  payment_id: orderData?.payment_id,
                  status: EPaymentStatus.paid,
                };
                const payment_confirm = await UpdatePayment(payment_detail);
                console.log(payment_confirm.data);
                router.replace("/(delivery)/confirmation/paymentcomplete");
              }
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
