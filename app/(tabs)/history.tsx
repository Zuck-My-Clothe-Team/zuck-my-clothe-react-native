import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { getFullOrderByUserID, updateOrderReview } from "@/api/order.api";
import { getBranchByID } from "@/api/branch.api";
import { getMachineDetailBySerial } from "@/api/machine.api";

import {
  IOrder,
  IOrderDetail,
  IOrderReview,
  ServiceTypeTH,
} from "@/interface/order.interface";
import { IBranch } from "@/interface/branch.interface";
import {
  IMachineInBranch,
  MachinePrice,
} from "@/interface/machinebranch.interface";
import Modal from "react-native-modal";
import StarRating from "@/components/historycomponent/starrating";
import { Kanit_300Light } from "@expo-google-fonts/kanit";
import { useAuth } from "@/context/auth.context";
import axios from "axios";
import { machine } from "os";

const imagepath = {
  Washing: require("../../assets/images/historypage/Washing.png"),
  Drying: require("../../assets/images/historypage/Drying.png"),
  Delivery: require("../../assets/images/historypage/Delivery.png"),
};

interface HistoryCard {
  orderheader: string;
  branch: string;
  machinenumber: string;
  CardType: string;
  Time: string;
  TotalCost: number;
  CostDetail: IOrderDetail[];
  star: number;
}

const HistoryPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [history, setHistory] = useState<HistoryCard[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [modal, setModal] = useState(false);
  const [star, setStar] = useState(5);
  const [confirmed, setConfirmed] = useState(false);
  const [review, setReview] = useState<IOrderReview>();
  const [comment, setComment] = useState("");

  const auth = useAuth();

  const fetchCompletedOrders = async () => {
    const fullOrder = await getFullOrderByUserID();
    return fullOrder.filter((order) =>
      order.order_details.every((detail) => detail.order_status === "Completed")
    );
  };

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const completedOrders = await fetchCompletedOrders();
      const newOrders = completedOrders.slice(offset, offset + 5);

      // Check if we've reached the end of the orders
      if (offset + 5 >= completedOrders.length) {
        setFinish(true);
      }

      setOffset((prev) => prev + 5);

      const updatedHistory = await Promise.all(
        newOrders.map(async (order) => {
          const branchDetail = await getBranchByID(order.branch_id);

          const retval: HistoryCard = {
            orderheader: order.order_header_id,
            branch: branchDetail.branch_name,
            machinenumber: "",
            CardType: "N/A",
            Time: order.created_at,
            TotalCost: 0,
            CostDetail: order.order_details,
            star: order.star_rating,
          };

          // Determine card type and fetch machine details
          if (order.zuck_onsite) { //assign cardtype
            retval.CardType = order.order_details[0].service_type;
            const machinedetail: IMachineInBranch =
              await getMachineDetailBySerial(
                order.order_details[0].machine_serial
              );
            const match = machinedetail.machine_label.match(/(\d+)/)
            match === null ? 
            retval.machinenumber = "" :
            retval.machinenumber = match[0];
          } else {
            retval.CardType = "Delivery";
          }

          // Calculate total cost
          retval.TotalCost = order.order_details.reduce(
            (total, detail) => total + MachinePrice[detail.weight],
            0
          );

          return retval;
        })
      );

      setHistory((prev) => [...prev, ...updatedHistory]);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  const resetparam = useCallback(() => {
    setOrders([]);
    setHistory([]);
    setOffset(0);
    setLoading(false);
    setFinish(false);
    setModal(false);
    setStar(5);
    setConfirmed(false);
    setReview(undefined);
    setComment("");
    loadHistory();
  }, []);

  useFocusEffect(resetparam);

  async function handleConfirmReview(
    review: IOrderReview,
    star: number,
    comment: string
  ) {
    review.star_rating = star;
    review.review_comment = comment;

    try {
      const updateReview = await updateOrderReview(review);
      console.log("Review updated successfully:", updateReview);
    } catch (err) {
      console.error("Error updating review:", err);
    }
  }

  function initialReviewState(hist: HistoryCard) {
    const review: IOrderReview = {
      order_header_id: hist.orderheader,
      review_comment: "",
      star_rating: 5,
      userID: auth?.authContext.user_id as string,
    };
    return review;
  }

  return (
    <View className="bg-background-1 w-full h-full">
      <SafeAreaView>
        <View className="px-5">
          {/* Header */}
          <View className="h-28 relative">
            <TouchableOpacity
              className="absolute pt-5 z-10"
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={48} color="#71BFFF" />
            </TouchableOpacity>
            <View className="absolute w-full h-full flex items-center justify-center">
              <Text className="text-4xl p-1 font-kanitMedium text-primaryblue-200 align-middle">
                ประวัติการซัก
              </Text>
            </View>
          </View>

          <Modal isVisible={modal}>
            <View className="bg-white rounded-xl px-5 py-5">
              <View
                className="flex flex-row justify-between border-b border-secondaryblue-100"
                style={{ paddingBottom: 20 }}
              >
                <Text className="text-primaryblue-200 font-kanit text-2xl">
                  ให้คะแนนการบริการ
                </Text>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <Feather name="x" size={24} color="#C6C6C6" />
                </TouchableOpacity>
              </View>

              <View className="items-center">
                <View className="" style={{ padding: 20 }}>
                  <StarRating
                    initialRating={star}
                    onRatingChange={(assignstar) => setStar(assignstar)}
                  ></StarRating>
                </View>
                <TextInput
                  className="border w-full rounded-lg"
                  style={{
                    textAlignVertical: "top",
                    padding: 10,
                    fontFamily: "Kanit_300Light",
                    fontSize: 14,
                    textDecorationColor: "#C6C6C6",
                  }}
                  multiline
                  numberOfLines={16}
                  maxLength={300}
                  placeholder="พิมพ์ข้อเสนอแนะบริเวณนี้"
                  inputMode="text"
                  onChangeText={(val) => setComment(val)}
                ></TextInput>

                <TouchableOpacity
                  onPress={async () => {
                    setConfirmed(true);
                    await handleConfirmReview(
                      review as IOrderReview,
                      star,
                      comment
                    );
                    setModal(false);
                    resetparam;
                  }}
                  disabled={confirmed}
                  className="bg-primaryblue-200 rounded-md mt-5"
                  style={{ paddingHorizontal: 35, paddingVertical: 10 }}
                >
                  <Text className="text-text-2 font-kanit text-xl text-center">
                    ยืนยัน
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* History List */}
          <ScrollView>
            {history && history.length > 0 ? history.map((history, index) => (
              <View
                key={index}
                className="border rounded-3xl px-5 py-4 bg-white"
                style={{ borderColor: "#F1F1F1", marginBottom: 16 }}
              >
                <Text className="text-primaryblue-200 text-3xl font-kanit">
                  สาขา {history.branch || "N/A"}
                </Text>
                <View className="flex flex-row justify-between px-5 py-4 border-t-secondaryblue-100 border-t-2">
                  <Image
                    source={
                      imagepath[history.CardType as keyof typeof imagepath]
                    }
                    style={{ width: history.CardType === "Delivery" ? 75 : 90 , height: 90 }}
                    resizeMode="contain"
                  />
                  <View className="justify-center">
                    <Text className="font-kanit text-text-1 text-xl">
                      {history.CardType.replace("Delivery", "บริการรับ-ส่งผ้า")
                        .replace("Washing", "เครื่องซัก")
                        .replace("Drying", "เครื่องอบ")}{" "}
                      {history.CardType !== "Delivery"
                        ? "หมายเลข " + history.machinenumber
                        : ""}
                    </Text>
                    <View className="flex flex-row">
                      <MaterialCommunityIcons
                        name="clock"
                        size={24}
                        color="#D8D8D8"
                      />
                      <Text className="pl-2 font-kanitLight text-text-4 text-base">
                        {new Date(history.Time).toLocaleDateString()} เวลา{" "}
                        {new Date(history.Time)
                          .toLocaleTimeString()
                          .replace("AM", "")
                          .replace("PM", "")}
                      </Text>
                    </View>
                  </View>
                  {history.CardType !== "Delivery" ? (
                    <Text className="font-kanit text-text-4 text-3xl align-middle ml-3">
                      {history.TotalCost}฿
                    </Text>
                  ) : 
                  (
                    <Text className="font-kanit text-white text-3xl align-middle ml-3">
                      {history.TotalCost}฿
                    </Text>
                  )}
                </View>
                {history.CardType === "Delivery" && (
                  <View className="pb-4">
                    {history.CostDetail.map((detail, index) => (
                      <View
                        key={index}
                        className="flex flex-row justify-between"
                      >
                        <Text className="font-kanitLight text-text-4 text-base">
                          {ServiceTypeTH[detail.service_type]}
                        </Text>
                        <Text className="font-kanitLight text-text-4 text-base">
                          {MachinePrice[detail.weight]}฿
                        </Text>
                      </View>
                    ))}
                    <View className="flex flex-row justify-between">
                      <Text className="font-kanitLight text-text-1 text-base">
                        ราคารวม
                      </Text>
                      <Text className="font-kanitLight text-text-1 text-base">
                        {history.TotalCost}฿
                      </Text>
                    </View>
                  </View>
                )}
                <View className="w-full flex flex-row justify-end">
                  {history.star === 0 ? (
                    <TouchableOpacity
                      className="px-12 py-2 rounded-md border"
                      style={{ borderColor: "#2594E1", paddingHorizontal: 28 }}
                      onPress={() => {
                        setModal(true);
                        setConfirmed(false);
                        setStar(5);
                        setReview(initialReviewState(history));
                      }}
                    >
                      <Text className="font-kanit text-xl text-primaryblue-100 text-center">
                        ให้คะแนน
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="px-12 py-2 rounded-md border bg-customgray-100"
                      style={{ borderColor: "#E3E3E3", paddingHorizontal: 28 }}
                      disabled={true}
                    >
                      <Text className="font-kanit text-xl text-center" style={{color:"#C6C6C6"}}>
                        ให้คะแนนแล้ว
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )) :
            <View className="h-full w-full items-center justify-center">
              <Text className="text-text-4 font-kanit text-xl text-center align-middle">ไม่พบประวัติการซัก</Text>
            </View>
            }

            {/* Load More Button */}
            <View
              className="flex items-center py-4"
              style={{ marginBottom: 310 }}
            >
              {!finish && (
                <TouchableOpacity
                  className="px-8 py-4 rounded-md bg-primaryblue-200"
                  onPress={loadHistory}
                  disabled={loading || finish}
                >
                  <Text className="text-white font-kanit text-xl">
                    {loading ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HistoryPage;