import { getMachineDetailBySerial } from "@/api/machine.api";
import CustomModal from "@/components/modal/CustomModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScanToReportPage = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setIsCameraActive(true);
      setScanned(false);
      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  useEffect(() => {
    if (permission?.granted) {
      // Camera permissions are granted.
      return;
    }

    // Request camera permissions when the component mounts.
    requestPermission();
  }, [permission?.granted, requestPermission]);

  const handleBarcodeScanned = async (event: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const machine = await getMachineDetailBySerial(event.data);
      if (machine) {
        router.replace({
          pathname: "/(report)/[machine_serial]",
          params: { machine_serial: machine.machine_serial },
        });
      } else {
        setIsModalVisible(true);
      }
    } catch {
      setIsModalVisible(true);
    } finally {
      setTimeout(() => setScanned(false), 2000);
      setIsCameraActive(true);
    }
  };


  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        icon={<Feather name="info" size={52} color="#71bfff" />}
        text={["QR Code ไม่ถูกต้อง", "กรุณาตรวจสอบอีกครั้ง"]}
      />
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <SafeAreaView className="h-full">
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
              <View>
                <Text className="font-kanitMedium text-4xl text-text-2">
                  สแกน Qr Code
                </Text>
                <Text className="font-kanit text-2xl text-secondaryblue-100">
                  สแกนหน้าเครื่องที่ต้องการรายงาน
                </Text>
              </View>
            </View>
            <View
              className="items-center justify-center"
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
});

export default ScanToReportPage;
