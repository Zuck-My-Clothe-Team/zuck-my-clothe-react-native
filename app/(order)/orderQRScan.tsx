import { getMachineDetailBySerial } from "@/api/machine.api";
import { updateStatusOrder } from "@/api/order.api";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import { IOrderUpdateDTO, OrderStatus } from "@/interface/order.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderQRScan = () => {
  // Extract parameters from route
  const { basket_id, service_type } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Request permissions
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Handle component lifecycle when screen is focused/unfocused
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      setScanned(false); // Reset scanned state

      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  // Handle barcode scan
  const handleScanner = useCallback(
    async (serial: string, basket_id: string, service_type: string) => {
      try {
        const machine_detail: IMachineInBranch = await getMachineDetailBySerial(
          serial
        );
        if (!machine_detail) {
          console.log("machine detail is empty");
          return;
        }

        if (!machine_detail.is_active) {
          Alert.alert(
            "ขออภัย ขณะนี้เครื่องยังไม่สามารถใช้งานได้",
            "เครื่องนี้ยังไม่สามารถใช้งานได้ ขออภัยในความไม่สะดวก",
            [
              {
                text: "OK",
                onPress: () => {
                  router.back();
                },
              },
            ]
          );
          return;
        }
        // if (!machine_detail.is_available) {
        //   Alert.alert(
        //     "ขออภัย ขณะนี้เครื่องยังไม่ว่าง",
        //     "เครื่องนี้ยังไม่ว่างครับ โปรดลองใหม่เมื่อเครื่องทำงานเสร็จ",
        //     [{ text: "OK",
        //       onPress:()=>{
        //         router.back();
        //       } }]
        //   );
        //   return;
        // }

        const machine_to_servicetype = machine_detail.machine_type.replace(
          "er",
          "ing"
        );

        // console.log(machine_to_servicetype,service_type)
        if (machine_to_servicetype !== service_type) {
          Alert.alert(
            "ขออภัย เครื่องนี้ไม่ใช่ชนิดเดียวกับออเดอร์",
            "ขออภัย เครื่องนี้ไม่ใช่ชนิดเดียวกับออเดอร์",
            [
              {
                text: "OK",
                onPress: () => {
                  router.back();
                },
              },
            ]
          );
          return;
        }

        const date = new Date();
        date.setMinutes(date.getMinutes() + 25); // Add 25 minutes
        const finished_at = date.toISOString();

        const order_update_dto: IOrderUpdateDTO = {
          finished_at: finished_at,
          machine_serial: serial,
          order_basket_id: basket_id,
          order_status: OrderStatus.Processing,
        };

        try {
          console.log("Updating order status...", order_update_dto);
          await updateStatusOrder(order_update_dto);
          router.back(); // Navigate back on success
        } catch (error) {
          console.error(
            "Error updating order status or machine status:",
            error
          );
        }
      } catch (error) {
        console.error("Error during handleScanner:", error);
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={async (event) => {
            if (!scanned) {
              setScanned(true); // Prevent further scans
              const serial = event.data; // Assume this contains the machine serial
              await handleScanner(
                serial,
                basket_id as string,
                service_type as string
              );
            }
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <AntDesign name="arrowleft" size={48} color="white" />
              </TouchableOpacity>
            </View>

            {/* Text Instructions */}
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>สแกน Qr Code</Text>
              <Text style={styles.subText}>
                สแกนหน้าเครื่องที่ท่านต้องการใช้งาน
              </Text>
            </View>

            {/* Scanner Icon */}
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="line-scan"
                size={400}
                color="white"
                style={{ opacity: 0.4 }}
              />
            </View>
          </SafeAreaView>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mainText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  subText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 18,
    color: "#87CEFA", // Adjust color as needed
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderQRScan;
