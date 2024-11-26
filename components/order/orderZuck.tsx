import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { IOrder, IOrderDetail, OrderStatus } from "@/interface/order.interface";
import { useAuth } from "@/context/auth.context";
import { getBranchByID } from "@/api/branch.api";
import { router, useFocusEffect } from "expo-router";
import OrderQRScan from "../../app/(order)/orderQRScan";

interface OrderZuckProps {
  zuckData: IOrder; // Define the type of the expected `zuckData` prop
}

const OrderZuck: React.FC<OrderZuckProps> = ({ zuckData }) => {
  //   console.log(zuckData);
  const zuckOrderOnly = zuckData.order_details.filter((detail) => {
    return detail.service_type === "Washing";
  });

  const dryOrderOnly = zuckData.order_details.filter((detail) => {
    return detail.service_type === "Drying";
  });

  const [buttonPressed,setButtonPressed] = useState<boolean>(false);

  const allorderisdone = (zuckData: IOrder): boolean => {
    const filtered: IOrderDetail[] = zuckData.order_details.filter((detail) =>
      detail.service_type === "Washing" || detail.service_type === "Drying"
    );
  
    for (const detail of filtered) {
      if (!detail.finished_at || new Date(detail.finished_at).getTime() > Date.now()) {
        return false; // Not all orders are done
      }
    }
    return true; // All orders are done
  };

  useFocusEffect(useCallback(()=>{
    setButtonPressed(false);
  },[]))
  

  return (
    <View className="mt-4 gap-4">
      {zuckOrderOnly.length !== 0 && (
        <View className=" bg-white rounded px-5">
          <Text
            className="font-kanit text-primaryblue-200"
            style={{ fontSize: 20 }}
          >
            รายการซัก
          </Text>
          {zuckOrderOnly.map((detail, index) => (
            <View key={index} className="flex flex-row justify-between my-3">
              <View className="flex flex-col">
                <Text className="font-kanit text-text-4 text-lg">
                  {" "}
                  ผ้าตะกร้า {index + 1}
                </Text>
                <Text className="font-kanitLight text-text-3 text-lg">
                  เครื่องซัก {detail.machine_serial} ขนาด {detail.weight} กิโล.
                </Text>
              </View>

              <View className="justify-center">
                {detail.order_status === OrderStatus.Completed ||
                detail.order_status === OrderStatus.Processing ? (
                  <TouchableOpacity
                    className="bg-customgray-100 border border-customgray-300 px-4 py-1 rounded-md"
                    // disabled={true}
                    onPress={() => {
                      if(!buttonPressed){
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
                    <Text className="text-customgray-400 font-kanit text-lg">
                      เริ่มซัก
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="bg-primaryblue-200 px-4 py-1 rounded-md"
                    onPress={() => {
                      if(!buttonPressed){
                        setButtonPressed(true);
                      router.push({
                        pathname: "/(order)/orderQRScan",
                        params: {
                          basket_id: detail.order_basket_id,
                          service_type: detail.service_type,
                        },
                      });}
                    }}
                  >
                    <Text className="text-text-2 font-kanit text-lg">
                      เริ่มซัก
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
      {dryOrderOnly.length !== 0 && (
        <View className=" bg-white rounded px-5">
          <Text
            className="font-kanit text-primaryblue-200"
            style={{ fontSize: 20 }}
          >
            รายการอบ
          </Text>
          {dryOrderOnly.map((detail, index) => (
            <View key={index} className="flex flex-row justify-between my-3">
              <View className="flex flex-col">
                <Text className="font-kanit text-text-4 text-lg">
                  {" "}
                  ผ้าตะกร้า {index + 1}
                </Text>
                <Text className="font-kanitLight text-text-3 text-lg">
                  เครื่องอบ {detail.machine_serial} ขนาด {detail.weight} กิโล.
                </Text>
              </View>

              <View className="justify-center">
                {detail.order_status === OrderStatus.Completed ||
                detail.order_status === OrderStatus.Processing ? (
                  <TouchableOpacity
                    className="bg-customgray-100 border border-customgray-300 px-4 py-1 rounded-md"
                    disabled={true}
                    // onPress={() => {console.log(detail.order_basket_id)}}
                  >
                    <Text className="text-customgray-400 font-kanit text-lg">
                      เริ่มอบ
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="bg-primaryblue-200 px-4 py-1 rounded-md"
                    onPress={() => {
                      if(!buttonPressed){
                        setButtonPressed(true);
                      router.push({
                        pathname: "/(order)/orderQRScan",
                        params: {
                          basket_id: detail.order_basket_id,
                          service_type: detail.service_type,
                        },
                      });}
                    }}
                  >
                    <Text className="text-text-2 font-kanit text-lg">
                      เริ่มอบ
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      <View className="py-5">
        <TouchableOpacity
          className="flex flex-row py-3 px-4 bg-yellowaccent-100 rounded-3xl justify-between border border-secondaryblue-300"
          onPress={() => {
            if(!buttonPressed){
              setButtonPressed(true);
            router.push({
              pathname: "/(order)/machine_status",
              params: { order_header_id: zuckData.order_header_id },
            });}
          }}
        >
          <Text className="text-text-3 font-kanit text-lg">
            ตรวจสอบการทำงาน
          </Text>
          <Text className="text-text-3 font-kanit text-lg">{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* <View className="py-5 items-center">
        {allorderisdone(zuckData) ? <TouchableOpacity
          style={{ width: 300 }}
          className="bg-primaryblue-200 border border-customgray-300 px-4 py-3 rounded-lg"
          onPress={() => {
          }}
        >
          <Text className="font-kanit text-text-2 text-xl text-center">
            เริ่มการจัดส่ง
          </Text>
        </TouchableOpacity>
         : 
         <TouchableOpacity
          style={{ width: 300 }}
          className="bg-customgray-100 border border-customgray-300 px-4 py-3 rounded-lg"
          disabled={true}
          onPress={()=>{
            
          }}
        >
          <Text className="font-kanit text-customgray-400 text-xl text-center">
            เริ่มการจัดส่ง
          </Text>
        </TouchableOpacity>}
      </View> */}
    </View>
  );
};

export default OrderZuck;
