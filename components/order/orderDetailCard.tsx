import { MachinePrice } from "@/interface/machinebranch.interface";
import { IOrderDetail, ServiceTypeTH } from "@/interface/order.interface";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type OrderDetailProps = {
  orderDetail: IOrderDetail[] | undefined;
};

type OrderDetailListProps = {
  quantity: number;
  product: keyof typeof ServiceTypeTH;
  size: string;
  price: number;
};

const OrderDetailList: React.FC<OrderDetailListProps> = (props) => {
  return (
    <View style={styles.rowSection}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ ...styles.bubbleBox }}>
          <Text style={styles.contentText}>{props.quantity}</Text>
        </View>
        <View>
          <Text style={styles.headingText}>{ServiceTypeTH[props.product]}</Text>
          {props.size !== "0" && (
            <Text style={styles.contentText}>ขนาด {props.size} kg.</Text>
          )}
        </View>
      </View>
      <Text style={styles.priceText}>{props.price}฿</Text>
    </View>
  );
};

const OrderDetailCard: React.FC<OrderDetailProps> = (props) => {
  if (!props.orderDetail) return <></>;

  const orderDetailList: OrderDetailListProps[] = Object.values(
    props.orderDetail.reduce((acc, orderDetail) => {
      const normalizedServiceType =
        orderDetail.service_type === "Delivery" ||
        orderDetail.service_type === "Pickup"
          ? "DeliveryOrPickup" // normalize Delivery and Pickup to DeliveryOrPickup
          : orderDetail.service_type;

      const key = `${orderDetail.order_header_id}-${normalizedServiceType}-${orderDetail.weight}`;
      if (!acc[key]) {
        acc[key] = {
          quantity: 0,
          product: normalizedServiceType,
          size: String(orderDetail.weight),
          price: 0,
        };
      }
      if (key.includes("DeliveryOrPickup")) {
        acc[key].quantity = 1;
      } else {
        acc[key].quantity++;
      }
      acc[key].price +=
        MachinePrice[orderDetail.weight] === 0
          ? 20
          : MachinePrice[orderDetail.weight];
      return acc;
    }, {} as { [key: string]: OrderDetailListProps })
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>รายการทั้งหมด</Text>
      </View>
      <View style={styles.cardBody}>
        {orderDetailList.map((item, index) => (
          <OrderDetailList key={index} {...item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    paddingBottom: 10,
  },
  cardHeaderText: {
    fontSize: 20,
    fontWeight: 400,
    fontFamily: "Kanit_400Regular",
    fontStyle: "normal",
    color: "#2594E1",
  },
  cardBody: {
    paddingVertical: 10,
    flexDirection: "column",
    gap: 10,
  },
  rowSection: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    fontWeight: 400,
    fontStyle: "normal",
    color: "#373737",
  },
  headingText_Blue: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    fontWeight: 400,
    fontStyle: "normal",
    color: "#2594E1",
  },
  contentText: {
    fontFamily: "Kanit_300Light",
    fontSize: 14,
    fontWeight: 300,
    fontStyle: "normal",
    color: "#696969",
  },
  bubbleBox: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#FFEFBD",
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  priceText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 20,
    fontWeight: 400,
    fontStyle: "normal",
    color: "#696969",
  },
});

export default OrderDetailCard;
