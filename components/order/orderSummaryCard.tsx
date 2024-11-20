import React, { useCallback, useEffect, useState } from "react";
import { IOrder, OrderStatus, ServiceType } from "@/interface/order.interface";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DateFormatter } from "@/utils/datetime";
import { FontAwesome } from "@expo/vector-icons";
import { getUserDetailByUserId } from "@/api/user.api";
import { IUserDetail } from "@/interface/userdetail.interface";

type OrderSummaryCardProps = {
  order: IOrder | null;
};

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = (props) => {
  const [employeeData, setEmployeeData] = useState<IUserDetail | null>(null);

  const confirmOrder =
    props.order?.order_details.find(
      (d) => d.service_type === ServiceType.Pickup
    )?.order_status !== OrderStatus.Waiting;

  const fetchUserDetail = useCallback(async () => {
    try {
      if (confirmOrder) {
        if (!props.order) return;
        const employeeId = props.order.order_details.find(
          (item) => item.service_type === ServiceType.Pickup
        )?.updated_by;
        if (!employeeId) return;
        const response = await getUserDetailByUserId(employeeId);

        if (!response || response.status !== 200) {
          throw new Error("Cannot fetch user detail");
        }
        const data: IUserDetail = response.data;
        setEmployeeData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [confirmOrder, props.order]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  if (!props.order) return <></>;

  const handleCallClient = () => {
    if (props.order) {
      const phoneNumber = props.order.user_detail.phone;
      if (phoneNumber) {
        Linking.openURL(`tel:${phoneNumber}`);
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>
          Order #{props.order.order_header_id.substring(0, 8)}{" "}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.rowSection}>
          <View>
            <Text style={styles.headingText}>
              {"คุณ " +
                props.order.user_detail.firstname +
                " " +
                props.order.user_detail.lastname}
            </Text>
            <Text style={styles.contentText}>
              {"เวลา: " +
                DateFormatter.getTime(new Date(props.order.created_at)) +
                " น. "}
              (
              {DateFormatter.getTimeDifference(
                new Date(props.order.created_at)
              )}
              )
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleCallClient}
          >
            <FontAwesome name="phone" size={20} color="#2594E1" />
            <Text style={styles.contactButtonText}>ติดต่อลูกค้า</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headingText}>ที่อยู่</Text>
        <TouchableOpacity
          style={styles.addressBox}
          onPress={() => {
            Linking.openURL(
              Platform.OS === "ios"
                ? `maps://app?daddr=${props.order?.delivery_lat},${props.order?.delivery_long}&dirflg=d&t=m`
                : `google.navigation:q=${props.order?.delivery_lat}+${props.order?.delivery_long}`
            );
          }}
        >
          <Image
            source={require("../../assets/images/mapMarker.png")}
            style={{ width: 18.78, height: 26 }}
          />
          <Text style={{ ...styles.contentText, flex: 2 }}>
            {props.order.delivery_address}
          </Text>
        </TouchableOpacity>
        <View style={styles.rowSection}>
          <Text style={styles.headingText}>โน้ต :</Text>
          <Text style={styles.contentText}>
            {props.order.order_note ?? "-"}
          </Text>
        </View>
        <View style={styles.rowSection}>
          <Text style={styles.headingText}>เพิ่มเติม :</Text>
          <Text
            style={{ ...styles.contentText, fontSize: 16, fontWeight: 400 }}
          >
            {props.order.order_details.find(
              (item) => item.service_type === ServiceType.Agents
            )
              ? "เพิ่มน้ำยาซักผ้าและปรับผ้านุ่ม"
              : "-"}
          </Text>
        </View>
        {confirmOrder && employeeData && (
          <>
            <Text style={styles.headingText_Blue}>รับออเดอร์โดย</Text>

            <Text
              style={{ ...styles.contentText, fontSize: 16, fontWeight: 400 }}
            >
              {employeeData.firstname + " " + employeeData.lastname}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BDE2FF",
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
  contactButton: {
    backgroundColor: "#BDE2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  contactButtonText: {
    textAlign: "center",
    fontFamily: "Kanit_300Light",
    fontSize: 14,
    fontWeight: 300,
    fontStyle: "normal",
    color: "#2594E1",
  },
  addressBox: {
    backgroundColor: "#F9FAFF",
    padding: 5,
    borderRadius: 30,
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default OrderSummaryCard;
