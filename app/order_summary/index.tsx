import { getBranchByID } from "@/api/branch.api";
import { getMachineDetailBySerial } from "@/api/machine.api";
import { createNewOrder } from "@/api/order.api";
import LoadingBubble from "@/components/auth/Loading";
import CustomModal from "@/components/modal/CustomModal";
import { useAuth } from "@/context/auth.context";
import { IBranch } from "@/interface/branch.interface";
import {
  IMachineInBranch,
  MachinePrice,
} from "@/interface/machinebranch.interface";
import { INewOrder } from "@/interface/order.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderSummary = () => {
  const auth = useAuth();
  const userData = auth?.authContext;
  const [machineData, setMachineData] = useState<IMachineInBranch>();
  const [branchData, setBranchData] = useState<IBranch>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInUseVisible, setModalInUseVisible] = useState(false);
  const [pressedNextPage, setPressedNextPage] = useState(false);
  const [newOrder, setNewOrder] = useState<INewOrder>();

  const handleScanner = useCallback(async (value: string) => {
    setLoading(true);
    try {
      const machine: IMachineInBranch = await getMachineDetailBySerial(value);
      const branchId = machine.branch_id;
      const branchDetail: IBranch = await getBranchByID(branchId);

      setMachineData(machine);
      setBranchData(branchDetail);
      setLoading(false);

      if (!machine.is_active) {
        setLoading(false);
        setModalVisible(true);
        return;
      }

      if (machine.finished_at) {
        setLoading(false);
        setModalInUseVisible(true);
        return;
      }
    } catch {
      setLoading(false);
      setModalVisible(true);
    }
  }, []);

  const { data } = useLocalSearchParams<{ data: string }>();

  useFocusEffect(
    useCallback(() => {
      setPressedNextPage(false);

      const runHandleScanner = async () => {
        await handleScanner(data);
      };

      runHandleScanner();

      return () => {
        // Cleanup code, if any
      };
    }, [data, handleScanner])
  );

  useEffect(() => {
    if (branchData) {
      setNewOrder({
        branch_id: branchData.branch_id,
        delivery_address: null,
        delivery_lat: null,
        delivery_long: null,
        order_details: [
          {
            machine_serial: data,
          },
        ],
        order_note: null,
        user_id: userData!.user_id,
        zuck_onsite: true,
      });
      // setIsSubmitting(false);
    }
  }, [branchData, data, machineData, userData]);

  async function placeOrder() {
    if (newOrder) {
      try {
        createNewOrder(newOrder);
        router.push("/order_summary/pay_complete");
      } catch {
        console.log("Error creating new order");
      }
    }
  }

  if (loading) return <LoadingBubble />;

  return (
    <View>
      <SafeAreaView className=" h-full px-9">
        <CustomModal
          visible={modalInUseVisible}
          setVisible={setModalInUseVisible}
          icon={<></>}
          text={["เครื่องนี้กำลังถูกใช้งาน", "โปรดเลือกเครื่องใหม่"]}
          onPress={() => {
            setModalInUseVisible(false);
            router.back();
          }}
        />

        <CustomModal
          visible={modalVisible}
          setVisible={setModalVisible}
          icon={<></>}
          text={["ไม่พบข้อมูลเครื่องซักผ้า", "โปรดตรวจสอบ QR Code อีกครั้ง"]}
          onPress={() => {
            setModalVisible(false);
            router.back();
          }}
        />

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
                ZMC {branchData?.branch_name}
              </Text>
            </View>

            <View className="flex flex-row mb-12">
              <View className="flex-1">
                <View>
                  <Text className="text-text-1 font-kanit text-xl">
                    {machineData?.machine_label.replace("ที่", "หมายเลข")}
                  </Text>
                </View>
                <View>
                  <Text className="text-text-4 font-kanitLight text-sm">
                    ขนาด {machineData?.weight} kg.
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-text-4 font-kanit text-xl">
                  {MachinePrice[machineData?.weight ?? 0]}฿
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
                {MachinePrice[machineData?.weight ?? 0]} ฿
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!pressedNextPage) {
                  setPressedNextPage(true);
                  placeOrder();
                }
              }}
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
