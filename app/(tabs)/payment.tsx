import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const PaymentPage = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.

    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(event) => {
          router.push({
            pathname: "/order_summary",
            params: { data: event.data },
          });
        }}
      >
        <SafeAreaView className=" h-full">
          <View className="px-5">
            <View className="h-28">
              <TouchableOpacity
                className="pt-5"
                onPress={() => {
                  router.back();
                }}
              >
                <AntDesign name="arrowleft" size={48} color="white" />
              </TouchableOpacity>
            </View>

            <View className="">
              <Text className="font-kanitMedium text-4xl text-text-2">
                สแกน Qr Code
              </Text>
              <Text className="font-kanit text-2xl text-secondaryblue-100">
                สแกนหน้าเครื่องที่ท่านต้องการใช้งาน
              </Text>
            </View>
          </View>
          <View
            className=" items-center justify-center"
            style={{ height: "65%" }}
          >
            <MaterialCommunityIcons
              className="opacity-40"
              name="line-scan"
              size={400}
              color="white"
            />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default PaymentPage;
