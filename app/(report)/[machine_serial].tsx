import { getBranchByID } from "@/api/branch.api";
import { getMachineDetailBySerial } from "@/api/machine.api";
import { reportMachine } from "@/api/report.api";
import CustomModal from "@/components/modal/CustomModal";
import { IBranch, MachineType } from "@/interface/branch.interface";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import { IMachineReport } from "@/interface/report.interface";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const ReportPage = () => {
  const washingMachineImage = require("@/assets/images/washmachine.png");
  const dryingMachineImage = require("@/assets/images/dryer.png");

  const params = useLocalSearchParams();
  const machine_serial = params.machine_serial;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [machineData, setMachineData] = React.useState<IMachineInBranch>();
  const [branchData, setBranchData] = React.useState<IBranch>();
  const [reportDesc, setReportDesc] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] =
    React.useState(true);

  useEffect(() => {
    async function fetchData() {
      if (machine_serial) {
        try {
          setIsLoaded(true);
          const data = await getMachineDetailBySerial(String(machine_serial));
          setMachineData(data);
          console.log("Machine data:", data);
        } catch (error) {
          console.error("Error during fetch machine by serial:", error);
        } finally {
          setIsLoaded(false);
        }
      }
    }
    fetchData();
  }, [machine_serial]);

  useEffect(() => {
    async function fetchBranchData(branch_id: string) {
      try {
        const data = await getBranchByID(branch_id);
        setBranchData(data);
      } catch (error) {
        console.error("Error during fetch branch by branch_id:", error);
      }
    }
    if (machineData) {
      fetchBranchData(machineData?.branch_id);
    }
  }, [machineData]);

  // useCallback(() => {}, []);

  async function handleSubmit() {
    if (!machineData) return;
    const reportData: IMachineReport = {
      machine_serial: machineData?.machine_serial,
      report_desc: reportDesc,
    };
    try {
      const result = await reportMachine(reportData);
      if (!result || result.status !== 200) {
        throw new Error("Error during report machine");
      }
      setIsModalVisible(true);
      // router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error during report machine:", error);
    }
  }

  if (isLoaded) {
    return (
      <ActivityIndicator className=" flex-1 justify-center items-center"></ActivityIndicator>
    );
  }

  return (
    <SafeAreaView className=" flex-1 px-5 bg-background-1">
      <CustomModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        icon={<Octicons name="check-circle-fill" size={46} color="#45d66b" />}
        text={["ขอบคุณสำหรับการรายงาน"]}
        secondary_text={["ทางเราจะรีบตรวจสอบและแก้ไขให้เร็วที่สุด"]}
      />

      <View className="w-full relative justify-start mt-3">
        <View>
          <Text className="py-1 text-center font-kanitMedium text-3xl text-primaryblue-200">
            รายงานเครื่อง
          </Text>
          <View className="py-[2px] absolute">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={36} color={"#71BFFF"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center", // Centers content vertically
        }}
        showsVerticalScrollIndicator={false}
        // keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View className="justify-center">
          <View className="bg-white border border-customgray-100 rounded-[10px] p-5 gap-y-4">
            <View className="flex flex-row gap-x-5 border-b border-secondaryblue-100 pb-4">
              {machineData?.machine_type === MachineType.Washer ? (
                <Image
                  source={washingMachineImage}
                  style={{ width: 65, aspectRatio: 0.97 }}
                />
              ) : (
                <Image
                  source={dryingMachineImage}
                  style={{ width: 65, aspectRatio: 0.98 }}
                />
              )}
              <View className="flex flex-1 flex-col justify-center gap-y-1">
                <Text className="text-primaryblue-200 text-xl font-kanit">
                  สาขา {branchData?.branch_name}
                </Text>
                <Text className="font-kanit text-lg text-text-1">
                  {machineData?.machine_label.replace("ที่", " หมายเลข")}
                </Text>
              </View>
            </View>
            <View className="mt-4">
              <TextInput
                className="h-[35vh] rounded border border-customgray-200 p-3 font-kanit text-lg"
                multiline
                placeholder="พิมพ์ปัญหาที่พบบริเวณนี้"
                onChangeText={(text) => {
                  if (text.length > 0) {
                    setReportDesc(text);
                    setIsSubmitButtonDisabled(false);
                  } else {
                    setIsSubmitButtonDisabled(true);
                  }
                }}
                keyboardType="default"
                aria-disabled={isSubmitButtonDisabled}
                shouldRasterizeIOS
              />
            </View>
            <View className="w-full items-center">
              <TouchableOpacity
                className={
                  isSubmitButtonDisabled
                    ? "w-1/3 px-6 py-2 rounded-md bg-customgray-100 border border-customgray-200"
                    : "w-1/3 px-6 py-2 rounded-md bg-primaryblue-200"
                }
                disabled={isSubmitButtonDisabled}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text
                  className={
                    isSubmitButtonDisabled
                      ? "text-customgray-400 font-kanit text-lg text-center"
                      : "text-text-2 font-kanit text-lg text-center"
                  }
                >
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ReportPage;
