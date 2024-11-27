import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { IOrder, IOrderDetail, OrderStatus } from "@/interface/order.interface";
import { router, useFocusEffect } from "expo-router";
import { getMachineDetailBySerial } from "@/api/machine.api";
import { IMachineInBranch } from "@/interface/machinebranch.interface";

// Extend IOrderDetail to include machine_label for internal use
interface IOrderDetailWithLabel extends IOrderDetail {
  machine_label?: string | null; // Add machine_label as optional
}

interface OrderZuckProps {
  zuckData: IOrder;
}

const OrderZuck: React.FC<OrderZuckProps> = ({ zuckData }) => {
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const [zuckOrderOnly, setZuckOrderOnly] = useState<IOrderDetailWithLabel[]>([]);
  const [dryOrderOnly, setDryOrderOnly] = useState<IOrderDetailWithLabel[]>([]);

  const handleLanding = async () => {
    const zuckOrderOnly = zuckData.order_details.filter(
      (detail) => detail.service_type === "Washing"
    );
    const dryOrderOnly = zuckData.order_details.filter(
      (detail) => detail.service_type === "Drying"
    );
  
    const extractNumbers = (label: string | null): string | null => {
      if (!label) return null;
      const numbers = label.match(/\d+/g); // Extract all numeric sequences
      return numbers ? numbers.join("") : null; // Join them into a single string
    };
  
    const zuckWithMachineLabels = await Promise.all(
      zuckOrderOnly.map(async (detail) => {
        try {
          if(detail.machine_serial === null)
            return { ...detail, machine_label: null }; 
          const machine: IMachineInBranch = await getMachineDetailBySerial(detail.machine_serial);
          return { ...detail, machine_label: extractNumbers(machine.machine_label) };
        } catch (error) {
          console.error("Error fetching machine detail for washing: ", error);
          return { ...detail, machine_label: null };
        }
      })
    );
  
    const dryWithMachineLabels = await Promise.all(
      dryOrderOnly.map(async (detail) => {
        try {
          if(detail.machine_serial === null)
            return { ...detail, machine_label: null };  
          const machine: IMachineInBranch = await getMachineDetailBySerial(detail.machine_serial);
          return { ...detail, machine_label: extractNumbers(machine.machine_label) };
        } catch (error) {
          console.error("Error fetching machine detail for drying: ", error);
          return { ...detail, machine_label: null };
        }
      })
    );
  
    setZuckOrderOnly(zuckWithMachineLabels);
    setDryOrderOnly(dryWithMachineLabels);
  };
  

  useFocusEffect(
    useCallback(() => {
      setButtonPressed(false);
      handleLanding();
    }, [])
  );

  const renderOrderDetails = (
    details: IOrderDetailWithLabel[],
    title: string
  ) => (
    <View className="bg-white rounded px-5">
      <Text className="font-kanit text-primaryblue-200" style={{ fontSize: 20 }}>
        {title}
      </Text>
      {details.map((detail, index) => (
        <View key={index} className="flex flex-row justify-between my-3">
          <View className="flex flex-col">
            <Text className="font-kanit text-text-4 text-lg">
              ผ้าตะกร้า {index + 1}
            </Text>
            <Text className="font-kanitLight text-text-3 text-lg">
              เครื่องหมายเลข{" "}
              {detail.machine_label || "-"} ขนาด {detail.weight} กิโล.
            </Text>
          </View>
          <View className="justify-center">
            {detail.order_status === OrderStatus.Completed ||
            detail.order_status === OrderStatus.Processing ? (
              <TouchableOpacity
                className="bg-customgray-100 border border-customgray-300 px-4 py-1 rounded-md"
                disabled={true}
              >
                <Text className="text-customgray-400 font-kanit text-lg">
                  {title === "รายการซัก" ? "เริ่มซัก" : "เริ่มอบ"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-primaryblue-200 px-4 py-1 rounded-md"
                onPress={() => {
                  if (!buttonPressed) {
                    setButtonPressed(true);
                    router.push({
                      pathname: "/(order)/orderQRScan",
                      params: {
                        basket_id: detail.order_basket_id,
                        service_type: detail.service_type,
                      },
                    });
                  }
                }}
              >
                <Text className="text-text-2 font-kanit text-lg">
                  {title === "รายการซัก" ? "เริ่มซัก" : "เริ่มอบ"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View className="mt-4 gap-4">
      {zuckOrderOnly.length > 0 && renderOrderDetails(zuckOrderOnly, "รายการซัก")}
      {dryOrderOnly.length > 0 && renderOrderDetails(dryOrderOnly, "รายการอบ")}

      <View className="py-5">
        <TouchableOpacity
          className="flex flex-row py-3 px-4 bg-yellowaccent-100 rounded-3xl justify-between border border-secondaryblue-300"
          style = {{borderColor:"#71bfff"}}
          onPress={() => {
            if (!buttonPressed) {
              setButtonPressed(true);
              router.push({
                pathname: "/(order)/machine_status",
                params: { order_header_id: zuckData.order_header_id },
              });
            }
          }}
        >
          <Text className="text-text-3 font-kanit text-lg">
            ตรวจสอบการทำงาน
          </Text>
          <Text className="text-text-3 font-kanit text-lg">{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderZuck;
