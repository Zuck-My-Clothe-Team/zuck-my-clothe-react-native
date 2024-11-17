import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PaymentCompletePage = () => {

  return (
    <View className=" flex-1 justify-center px-7 bg-background-1">
      <Text className=" font-kanitMedium text-3xl text-text-1">
        รายการถูกจัดส่งแล้ว
      </Text>
      <Text className=" font-kanit text-lg text-secondaryblue-300">
        อดใจรออีกสักครู่
      </Text>
      <Text className=" font-kanit text-lg text-secondaryblue-300">
        พนักงานของเรากำลังเดินทางไปรับผ้าของคุณ
      </Text>

      <View className=" justify-center items-center py-28">
        <Octicons name="check-circle-fill" size={164} color="#9ad2ff" />
      </View>

      <TouchableOpacity
        className=" bg-primaryblue-200 py-3 rounded-lg items-center"
        onPress={() => {
            router.back();
        }}
      >
        <Text className=" font-kanit text-base text-text-2">
          กลับสู่หน้าหลัก
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentCompletePage;
