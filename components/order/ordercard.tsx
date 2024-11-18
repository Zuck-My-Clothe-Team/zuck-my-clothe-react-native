import {
  IOrder,
  OrderStatus,
  ServiceType,
  WorkingStatus,
  WorkingStatusTH,
} from "@/interface/order.interface";
import { DateFormatter } from "@/utils/datetime";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IOrderDetail } from "../../interface/order.interface";
import { GetStatusOrderFromOrderDetails } from "@/utils/utils";

type props = {
  order: IOrder;
};

const OrderCard: React.FC<props> = (props) => {
  const getStatus = useCallback((detail: IOrderDetail[]) => {
    const status = GetStatusOrderFromOrderDetails(detail);

    switch (status) {
      case WorkingStatus.Waiting:
        return (
          <View style={styles.pendingStatus}>
            <Text style={styles.pendingStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.Pickup:
        return (
          <View style={styles.processingStatus}>
            <Text style={styles.processingStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.BackToStore:
        return (
          <View style={styles.processingStatus}>
            <Text style={styles.processingStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.Processing:
        return (
          <View style={styles.processingStatus}>
            <Text style={styles.processingStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.OutOfDelivery:
        return (
          <View style={styles.processingStatus}>
            <Text style={styles.processingStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.Completed:
        return (
          <View style={styles.completedStatus}>
            <Text style={styles.completedStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      case WorkingStatus.Canceled:
        return (
          <View style={styles.canceledStatus}>
            <Text style={styles.canceledStatusText}>
              {WorkingStatusTH[status]}
            </Text>
          </View>
        );
      default:
        return null;
    }
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>
          Order #{props.order.order_header_id.substring(0, 8)}
        </Text>
        {getStatus(props.order.order_details)}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.clientText}>
          คุณ
          {props.order.user_detail?.firstname ??
            "" + " " + props.order.user_detail?.lastname ??
            ""}
        </Text>
        <Text style={styles.deliveryText}>{props.order.delivery_address}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardFooterContent}>
          <AntDesign name="clockcircle" size={16} color="#C6C6C6" />
          <Text style={styles.dateTimeText}>
            {DateFormatter.getStringDateTime(new Date(props.order.created_at))}
          </Text>
          <Text style={styles.timeAgoText}>
            ({DateFormatter.getTimeDifference(new Date(props.order.created_at))}
            )
          </Text>
        </View>
        <MaterialIcons name="navigate-next" size={16} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cardBody: { flexDirection: "column" },
  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooterContent: { flexDirection: "row", alignItems: "center", gap: 5 },
  orderNumber: {
    fontSize: 20,
    fontFamily: "Kanit",
    fontWeight: "400",
    color: "#2594E1",
  },
  clientText: {
    color: "#373737",
    fontSize: 16,
    fontFamily: "Kanit",
    fontWeight: 400,
  },
  deliveryText: {
    color: "#696969",
    fontSize: 16,
    fontFamily: "Kanit",
    fontWeight: 400,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: 300,
    fontFamily: "Kanit",
    color: "#373737",
  },
  timeAgoText: {
    fontSize: 14,
    fontWeight: 300,
    fontFamily: "Kanit",
    color: "#696969",
  },
  pendingStatus: {
    backgroundColor: "#BDE2FF",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 30,
  },
  pendingStatusText: {
    textAlign: "center",
    fontFamily: "Kanit",
    fontSize: 16,
    fontWeight: 400,
    color: "#0080D7",
  },
  processingStatus: {
    backgroundColor: "#FFEFBD",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 30,
  },
  processingStatusText: {
    textAlign: "center",
    fontFamily: "Kanit",
    fontSize: 16,
    fontWeight: 400,
    color: "#696969",
  },
  completedStatus: {
    backgroundColor: "#0285DF",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 30,
  },
  completedStatusText: {
    textAlign: "center",
    fontFamily: "Kanit",
    fontSize: 16,
    fontWeight: 400,
    color: "#F9FAFF",
  },
  canceledStatus: {
    backgroundColor: "#F0507E",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 30,
  },
  canceledStatusText: {
    textAlign: "center",
    fontFamily: "Kanit",
    fontSize: 16,
    fontWeight: 400,
    color: "#F9FAFF",
  },
});
export default OrderCard;
