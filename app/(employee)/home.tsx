import { getEmployeeContractByUserId } from "@/api/employeeContract.api";
import { getAllOrderInBranch } from "@/api/order.api";
import OrderCard from "@/components/order/ordercard";
import {
  ONEDAY_INMILLISECONDS,
  ONESECOND_INMILLISECONDS,
} from "@/constants/constants";
import { useAuth } from "@/context/auth.context";
import { IEmployeeContract } from "@/interface/employeeContract.interface";
import {
  IOrder,
  WorkingStatus,
  WorkingStatusTH,
} from "@/interface/order.interface";
import { GetStatusOrderFromOrderDetails } from "@/utils/utils";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomeEmployeePage = () => {
  const auth = useAuth();
  const [filter, setFilter] = useState<WorkingStatus | "All">("All");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<IOrder[]>([]);

  const filterTabs: { label: string; value: WorkingStatus | "All" }[] = [
    { label: "ทั้งหมด", value: "All" },
    {
      label: WorkingStatusTH[WorkingStatus.Waiting],
      value: WorkingStatus.Waiting,
    },
    {
      label: WorkingStatusTH[WorkingStatus.Pickup],
      value: WorkingStatus.Pickup,
    },
    {
      label: WorkingStatusTH[WorkingStatus.BackToStore],
      value: WorkingStatus.BackToStore,
    },
    {
      label: WorkingStatusTH[WorkingStatus.Processing],
      value: WorkingStatus.Processing,
    },
    {
      label: WorkingStatusTH[WorkingStatus.OutOfDelivery],
      value: WorkingStatus.OutOfDelivery,
    },
    {
      label: WorkingStatusTH[WorkingStatus.Completed],
      value: WorkingStatus.Completed,
    },
    {
      label: WorkingStatusTH[WorkingStatus.Canceled],
      value: WorkingStatus.Canceled,
    },
  ];

  const fetchOrder = useCallback(async (branch_id: string) => {
    try {
      const response = await getAllOrderInBranch(branch_id);
      setOrderData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        if (auth) {
          const response = await getEmployeeContractByUserId(
            auth.authContext.user_id
          );

          if (response.status !== 200) {
            throw new Error("Cannot fetch employee contract");
          }
          const branchId: IEmployeeContract[] = response.data;
          await fetchOrder(branchId[0].branch_id);
        }
        setLoading(false);
      };

      fetchData();

      const intervalId = setInterval(fetchData, 30 * ONESECOND_INMILLISECONDS); // Fetch every 30 seconds
      return () => clearInterval(intervalId);
    }, [auth, fetchOrder])
  );

  const filteredOrderData = orderData
    .filter(
      (order) =>
        !order.zuck_onsite &&
        Date.now() - new Date(order.created_at).getTime() <
          3 * ONEDAY_INMILLISECONDS
    )
    .filter((order) =>
      filter === "All"
        ? true
        : filter === GetStatusOrderFromOrderDetails(order.order_details)
    )
    .sort((a, b) => {
      if (a.created_at < b.created_at) return 1;
      if (a.created_at > b.created_at) return -1;
      return 0;
    });

  return (
    <SafeAreaView style={{ backgroundColor: "#0285DF", flex: 1 }}>
      <View style={styles.headerBg}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>ออเดอร์ซัก-ส่ง</Text>
        </View>
      </View>
      <ScrollView
        style={styles.bodyBg}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ScrollView horizontal={true}>
          <View style={styles.filterTabsGroup}>
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.value}
                onPress={() => {
                  setFilter(tab.value);
                }}
                style={
                  filter === tab.value
                    ? styles.activeFilterTab
                    : styles.filterTab
                }
              >
                <Text style={styles.textFilter}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.orderSection}>
          {loading ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color="#0285DF" />
            </View>
          ) : filteredOrderData.length === 0 ? (
            <Text style={styles.text}>ไม่มีออเดอร์</Text>
          ) : (
            filteredOrderData.map((order) => (
              <TouchableOpacity
                style={{ width: "100%" }}
                key={order.order_header_id}
                onPress={() =>
                  router.push({
                    pathname: `/(order)/order_detail/[id]`,
                    params: { id: order.order_header_id },
                  })
                }
              >
                <OrderCard key={order.order_header_id} order={order} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerBg: {
    position: "relative",
    backgroundColor: "#0285DF",
    flexDirection: "row",
  },
  header: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  filterTabsGroup: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  activeFilterTab: {
    borderRadius: 30,
    backgroundColor: "#0285DF",
    paddingVertical: 3,
    paddingHorizontal: 25,
  },
  filterTab: {
    borderRadius: 30,
    backgroundColor: "#D8D8D8",
    paddingVertical: 3,
    paddingHorizontal: 25,
  },
  textFilter: {
    textAlign: "center",
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    fontWeight: 400,
    color: "#FFFFFF",
  },
  textHeader: {
    fontSize: 28,
    color: "#F9FAFF",
    fontFamily: "Kanit_500Medium",
    fontWeight: 500,
  },
  orderSection: {
    flex: 1,
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyBg: {
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  scrollViewContent: {
    paddingBottom: 300,
  },
  text: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
  },
});

export default HomeEmployeePage;
