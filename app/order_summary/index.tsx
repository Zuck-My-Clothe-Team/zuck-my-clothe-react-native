import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { getMachineDetailBySerial } from "@/api/machine.api";
import {
  IMachineInBranch,
  MachinePrice,
} from "@/interface/machinebranch.interface";
import { IBranch } from "@/interface/branch.interface";
import { getBranchByID } from "@/api/branch.api";
import { machine } from "os";
import LoadingBubble from "@/components/auth/Loading";
import Modal from "react-native-modal";

const OrderSummary = () => {
  const [machineData, setMachineData] = useState<IMachineInBranch>();
  const [branchData, setBranchData] = useState<IBranch>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedNextPage, setPressedNextPage] = useState(false);

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
        setModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      setModalVisible(true);
    }
  }, []);

  const { data } = useLocalSearchParams<{ data: string }>();

  useFocusEffect(
    React.useCallback(() => {

      setPressedNextPage(false);

      const runHandleScanner = async () => {
        await handleScanner(data);
      };

      runHandleScanner();

      return () => {
        // Cleanup code, if any
      };
    }, [data]) // Ensure dependencies are up-to-date
  );

  if (loading) return <LoadingBubble />;

  return (
    <View>
      <SafeAreaView className=" h-full px-9">
        <Modal
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          isVisible={modalVisible}
          useNativeDriver={true}
        >
          <View className="h-full items-center justify-center">
            <View
              className="bg-background-1 rounded-xl border border-secondaryblue-100"
              style={{ paddingHorizontal: 16, paddingVertical: 16 }}
            >
              <View>
                <Text className="text-text-3 text-xl font-kanit">
                  รูปแบบ QR Code ไม่ถูกต้อง
                </Text>
                <Text className="text-text-4 text-xl font-kanit">
                  โปรดตรวจสอบและสแกนใหม่อีกครั้ง
                </Text>
              </View>
              <TouchableOpacity
                style={{ marginTop: 16 }}
                className="items-center"
                onPress={() => {
                  setModalVisible(false);
                  router.push("/(tabs)/payment");
                }}
              >
                <Text className="px-8 font-kanit text-text-2 text-base bg-primaryblue-200">
                  ตกลง
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
                  router.push("/order_summary/pay_complete");
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
