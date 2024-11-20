import React from "react";
import { getOrderByOrderHeaderId, updateStatusOrder } from "@/api/order.api";
import LoadingBubble from "@/components/auth/Loading";
import OrderDetailCard from "@/components/order/orderDetailCard";
import OrderSummaryCard from "@/components/order/orderSummaryCard";
import {
  IOrder,
  IOrderUpdateDTO,
  OrderStatus,
  ServiceType,
} from "@/interface/order.interface";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetStatusOrderFromOrderDetails } from "@/utils/utils";
import { WorkingStatus } from "../../../interface/order.interface";

const OrderDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrder = useCallback(async (orderHeaderId: string) => {
    try {
      setLoading(true);
      if (!orderHeaderId) throw new Error("No order id");
      const result = await getOrderByOrderHeaderId(orderHeaderId);
      if (!result || result.status !== 200)
        throw new Error("Cannot fetch order");
      const data: IOrder = result.data;
      setOrderData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateOrder = useCallback(async (updateDTO: IOrderUpdateDTO) => {
    try {
      if (!updateDTO) throw new Error("No order data");
      const result = await updateStatusOrder(updateDTO);
      if (!result || result.status !== 200) throw new Error(result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useMemo(async () => {
    await fetchOrder(id);
  }, [fetchOrder, id]);

  if (loading || !orderData) return <LoadingBubble />;

  const status = GetStatusOrderFromOrderDetails(orderData.order_details);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.headerBg}>
        <AntDesign
          name="arrowleft"
          size={24}
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          color="#71BFFF"
          onPress={() => {
            router.back();
          }}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>รายละเอียด</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <OrderSummaryCard order={orderData} />
        <View style={{ marginTop: 20 }}>
          <OrderDetailCard orderDetail={orderData?.order_details} />
        </View>

        {WorkingStatus[status] === WorkingStatus.Waiting && (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={async () => {
                if (!orderData) return;
                orderData.order_details.forEach(async (orderDetail) => {
                  const updateDTO: IOrderUpdateDTO = {
                    finished_at: new Date().toISOString(),
                    machine_serial: null,
                    order_basket_id: orderDetail.order_basket_id,
                    order_status: OrderStatus.Canceled,
                  };
                  await handleUpdateOrder(updateDTO);
                });
                router.back();
              }}
            >
              <Text style={styles.deleteButtonText}>ยกเลิกรายการ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                if (!orderData) return;
                const basketId = orderData.order_details.find(
                  (orderDetail) =>
                    orderDetail.service_type === ServiceType.Pickup
                )?.order_basket_id;

                if (!basketId) return;
                const updateDTO: IOrderUpdateDTO = {
                  finished_at: new Date().toISOString(),
                  machine_serial: null,
                  order_basket_id: basketId,
                  order_status: OrderStatus.Processing,
                };
                await handleUpdateOrder(updateDTO);
                await fetchOrder(id);
              }}
            >
              <Text style={styles.saveButtonText}>ยืนยันรายการ</Text>
            </TouchableOpacity>
          </>
        )}

        {WorkingStatus[status] === WorkingStatus.Pickup && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              if (!orderData) return;
              const basketId = orderData.order_details.find(
                (orderDetail) => orderDetail.service_type === ServiceType.Pickup
              )?.order_basket_id;

              if (!basketId) return;
              const updateDTO: IOrderUpdateDTO = {
                finished_at: new Date().toISOString(),
                machine_serial: null,
                order_basket_id: basketId,
                order_status: OrderStatus.Completed,
              };
              await handleUpdateOrder(updateDTO);
              await fetchOrder(id);
            }}
          >
            <Text style={styles.saveButtonText}>รับผ้าสำเร็จ</Text>
          </TouchableOpacity>
        )}
        {(WorkingStatus[status] === WorkingStatus.BackToStore ||
          WorkingStatus[status] === WorkingStatus.Processing) && (
          <Text> ไปซักผ้า </Text>
        )}
        {WorkingStatus[status] === WorkingStatus.OutOfDelivery && (
          <Text> ไปส่งผ้า </Text>
        )}
        {WorkingStatus[status] === WorkingStatus.Completed && (
          <Text> ส่งถึงที่ละจ้า </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#F9FAFF",
    height: "100%",
  },
  headerBg: {
    position: "relative",
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#2594E1",
    fontSize: 28,
    fontWeight: 500,
    fontFamily: "Kanit_500Medium",
    fontStyle: "normal",
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  deleteButton: {
    marginTop: 20,
    paddingHorizontal: 26,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F0507E",
    backgroundColor: "#F9FAFF",
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "Kanit_400Regular",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F0507E",
    textAlign: "center",
  },
  saveButton: {
    marginTop: 20,
    paddingHorizontal: 26,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#2594E1",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Kanit_400Regular",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F9FAFF",
    textAlign: "center",
  },
});
export default OrderDetail;
