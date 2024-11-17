import { getAddressById } from "@/api/address.api";
import { getClosestBranch } from "@/api/branch.api";
import { getAvailableMachineByBranchID } from "@/api/machine.api";
import { createNewOrder } from "@/api/order.api";
import { getUserAddress } from "@/api/useraddress.api";
import { useAuth } from "@/context/auth.context";
import { IBranch } from "@/interface/branch.interface";
import { ICreatedOrder, INewOrder } from "@/interface/order.interface";
import { IUserAddress } from "@/interface/userdetail.interface";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, SplashScreen, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import ModalLib from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const washmachineImage = require("../../assets/images/washmachine.png");
const dryerImage = require("../../assets/images/dryer.png");

SplashScreen.preventAutoHideAsync();

const WarningModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View>
      <ModalLib
        isVisible={visible}
        className=" flex justify-center items-center"
        onBackdropPress={() => {
          setVisible(false);
        }}
        animationInTiming={350}
        animationOutTiming={350}
        hasBackdrop
      >
        <View className=" w-11/12 bg-white justify-center items-center rounded-xl py-6 flex flex-col gap-y-4">
          <Feather name="info" size={52} color="#71bfff" />
          <Text className=" font-kanit text-text-1 text-xl">
            กรุณาเลือกน้ำหนักเครื่องซักผ้า
          </Text>
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            className=" px-6 py-2 bg-primaryblue-200 rounded-lg"
          >
            <Text className=" text-white font-kanit">ตกลง</Text>
          </TouchableOpacity>
        </View>
      </ModalLib>
    </View>
  );
};

const DeliveryPage = () => {
  const auth = useAuth();
  const userData = auth?.authContext;

  const [userAddress, setUserAddress] = useState<IUserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IUserAddress>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnAvailableModalVisible, setIsUnAvailableModalVisible] =
    useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState("");
  const [branchdata, setBranchdata] = useState<IBranch>();
  const [washerdata, setWasherData] = useState([
    { label: "ขนาด 7 kg.", value: "7" },
    { label: "ขนาด 14 kg.", value: "14" },
    { label: "ขนาด 21 kg.", value: "21" },
  ]);
  const [dryerdata, setDryerdata] = useState([
    { label: "ขนาด 7 kg.", value: "7" },
    { label: "ขนาด 14 kg.", value: "14" },
    { label: "ขนาด 21 kg.", value: "21" },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressNotFound, setAddressNotFound] = useState<boolean>(false);
  const [amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCheckedDryer, setIsCheckedDryer] = useState(false);
  const [isCheckedDetergents, setIsCheckedDetergents] = useState(false);
  const [isDryerOnly, setIsDryerOnly] = useState(false);

  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);

  const [newOrder, setNewOrder] = useState<INewOrder>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createdOrder, setCreatedOrder] = useState<ICreatedOrder>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [machineAvailbleAmount, setMachineAvailbleAmount] = useState({
    Washer: [
      { weight: 7, amount: 0 },
      { weight: 14, amount: 0 },
      { weight: 21, amount: 0 },
    ],
    Dryer: [
      { weight: 7, amount: 0 },
      { weight: 14, amount: 0 },
      { weight: 21, amount: 0 },
    ],
  });

  useEffect(() => {
    if (branchdata && selectedAddress) {
      const address =
        selectedAddress.address +
        " " +
        selectedAddress.subdistrict +
        " " +
        selectedAddress.district +
        " " +
        selectedAddress.province +
        " " +
        selectedAddress.zipcode;

      setNewOrder({
        branch_id: branchdata.branch_id || "",
        delivery_address: address || "",
        delivery_lat: selectedAddress.lat || 0,
        delivery_long: selectedAddress.long || 0,
        order_detail: [],
        order_note: "",
        userID: userData?.user_id || "",
        zuck_onsite: false,
      });
    }
  }, [branchdata, selectedAddress, userData?.user_id, isSubmitting]);

  useEffect(() => {
    if (value !== "") {
      setNewOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;
        return {
          ...prevOrder,
          order_detail: [
            ...prevOrder.order_detail,
            ...Array.from({ length: amount }, () => ({
              service_type: "Washer",
              weight: Number(value) as 0 | 7 | 14 | 21, // Replace with dynamic weight
            })),
          ],
        };
      });

      if (isCheckedDryer && Number(value) * amount <= 21) {
        setNewOrder((prevOrder) => {
          if (!prevOrder) return prevOrder;
          return {
            ...prevOrder,
            order_detail: [
              ...prevOrder.order_detail,
              {
                service_type: "Dryer", // Add the specific details for the new element
                weight: (Number(value) * amount) as 0 | 7 | 14 | 21, // Replace with dynamic weight
              },
            ],
          };
        });
      }

      if (isCheckedDetergents) {
        setNewOrder((prevOrder) => {
          if (!prevOrder) return prevOrder;
          return {
            ...prevOrder,
            order_detail: [
              ...prevOrder.order_detail,
              {
                service_type: "Agents", // Add the specific details for the new element
                weight: 0,
              },
            ],
          };
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    async function createOrder() {
      if (newOrder) {
        try {
          const data = await createNewOrder(newOrder);
          setCreatedOrder(data);
          setIsSuccess(true);
        } catch (error) {
          console.error("Error creating new order:", error);
          setIsSuccess(false);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
    createOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    console.log(newOrder);
  }, [newOrder]);

  const fetchAddressData = useCallback(async () => {
    setLoading(true);
    const addressId = await AsyncStorage.getItem("addressId");
    try {
      setLoading(true);
      if (!addressId) throw new Error("Address ID not found");
      const result = await getAddressById(addressId);
      if (!result || result.status === 204) {
        throw new Error("Address not found");
      }
      const address = result.data;
      setUserAddress(address);
      setLoading(false);
    } catch {
      setLoading(true);
      const data = await getUserAddress();
      if (data === null || data === undefined) {
        setSelectedAddress(undefined);
        setAddressNotFound(true);
        setLoading(false);
      } else {
        setUserAddress(data);
        setSelectedAddress(data[0]);
        setAddressNotFound(false);
        setLoading(false);
      }
      setIsSubmitting(false);
      setLoading(false);
    }
    setIsCheckedDryer(isCheckedDryer);
    setIsCheckedDetergents(isCheckedDetergents);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Fetch address data when page is focused
  useFocusEffect(
    useCallback(() => {
      setUserAddress([]);
      fetchAddressData();
    }, [fetchAddressData])
  );

  const handleSelectAddress = (address: IUserAddress) => {
    setSelectedAddress(address);
    setIsModalVisible(false);
    setValue("");
  };

  const price = useMemo(() => {
    if (value === "7") {
      return 50;
    } else if (value === "14") {
      return 100;
    } else if (value === "21") {
      return 150;
    }
  }, [value]);

  // Fetch branch data when selected address changes
  useEffect(() => {
    async function fetchBranchData() {
      if (selectedAddress) {
        try {
          const branch = await getClosestBranch({
            user_lat: selectedAddress.lat,
            user_lon: selectedAddress.long,
          });
          if (branch && branch.length > 0) {
            setBranchdata(branch[0]);
            setAmount(1);
            setIsUnAvailableModalVisible(false);
          } else {
            setBranchdata(undefined);
            setIsUnAvailableModalVisible(true);
          }
        } catch (error) {
          console.error("Error fetching branch data:", error);
        }
      }
    }
    fetchBranchData();
  }, [selectedAddress]);

  // Fetch machine data when branch data changes
  useEffect(() => {
    async function fetchMachineData() {
      if (branchdata) {
        try {
          const machine = await getAvailableMachineByBranchID(
            branchdata.branch_id
          );
          if (machine === null || machine === undefined) {
            setWasherData([]);
            setDryerdata([]);
            return;
          }
          // set unique weight of machine_type "washer" to dropdown
          const washer = machine
            .filter((item) => item.machine_type === "Washer")
            .sort((a, b) => a.weight - b.weight);
          const uniqueWeight = Array.from(
            new Set(washer.map((item) => item.weight))
          );
          const data = uniqueWeight.map((weight) => {
            return { label: `ขนาด ${weight} kg.`, value: weight.toString() };
          });
          setWasherData(data);

          // set unique weight of machine_type "dryer" to dropdown
          const availableDryer = machine
            .filter((item) => item.machine_type === "Dryer")
            .sort((a, b) => a.weight - b.weight);

          const uniqueDryerWeight = Array.from(
            new Set(availableDryer.map((item) => item.weight))
          );
          const dryerData = uniqueDryerWeight.map((weight) => {
            return { label: `ขนาด ${weight} kg.`, value: weight.toString() };
          });
          setDryerdata(dryerData);

          // set machine available amount
          const washerAmount = uniqueWeight.map((weight) => {
            return {
              weight: weight,
              amount: washer.filter((item) => item.weight === weight).length,
            };
          });

          const dryerAmount = uniqueDryerWeight.map((weight) => {
            return {
              weight: weight,
              amount: availableDryer.filter((item) => item.weight === weight)
                .length,
            };
          });

          setMachineAvailbleAmount({
            Washer: washerAmount,
            Dryer: dryerAmount,
          });
        } catch (error) {
          console.error("Error fetching machine data:", error);
        }
      }
    }
    fetchMachineData();
  }, [branchdata, selectedAddress, isFocus]);

  useEffect(() => {
    if (value === "") return;
    setTotalPrice((price ?? 0) * amount);
  }, [amount, price, value]);

  const handleModeChange = () => {
    setIsDryerOnly(!isDryerOnly);
    setTotalPrice(0);
    setValue("");
    setAmount(1);
    setIsCheckedDryer(false);
    setIsCheckedDetergents(false);
  };

  if (loading)
    return (
      <ActivityIndicator size={"large"} color={"#000"} className=" h-full" />
    );

  return (
    <>
      <SafeAreaView className=" bg-background-1 flex-1" edges={["top"]}>
        {/* Warning Modal */}
        <WarningModal
          visible={isWarningModalVisible}
          setVisible={setIsWarningModalVisible}
        />

        {/* Address Modal */}
        <Modal visible={isModalVisible} animationType="slide">
          <View className=" flex-1 justify-center items-center">
            <View className=" w-5/6 h-3/4 bg-white rounded-xl">
              <View className=" flex flex-row justify-between">
                <Text className=" font-kanit text-2xl text-primaryblue-200">
                  ที่อยู่รับส่ง
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <Ionicons name="close" size={30} color={"#2594e1"} />
                </TouchableOpacity>
              </View>
              <ScrollView
                className="mt-5"
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {userAddress.map((address) => (
                  <TouchableOpacity
                    className="flex flex-row gap-x-4 border-b border-customgray-200 py-4 justify-center items-center"
                    onPress={() => {
                      handleSelectAddress(address);
                    }}
                    key={address.address_id}
                  >
                    <View className=" flex flex-col justify-center items-center">
                      <MaterialIcons
                        name="location-pin"
                        size={24}
                        color="#0285df"
                      />
                    </View>
                    <View className=" w-full flex flex-row gap-x-4 flex-1">
                      <View>
                        <Text className=" flex flex-row font-kanit text-base">
                          {address.address +
                            " " +
                            address.subdistrict +
                            " " +
                            address.district +
                            " " +
                            address.province +
                            " " +
                            address.zipcode}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: "/edit_address/[id]",
                          params: { id: address.address_id },
                        });
                        setIsModalVisible(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={24}
                        color="#71BFFF"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={[styles.button, { width: "80%" }]}
              onPress={() => {
                // router.navigate("/(address)/address");
                setIsModalVisible(false);
                router.push("/(address)/create_address");
              }}
            >
              <Text style={styles.buttonText}>+ เพิ่มที่อยู่</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View className=" w-full relative mt-3">
          <View className="">
            <Text className=" text-center font-kanitMedium text-3xl text-primaryblue-200">
              บริการซัก - ส่งผ้า
            </Text>
          </View>
          <View className=" px-6 absolute">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={30} color={"#2594e1"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="">
          {/* Address Card */}
          <View className="">
            <View className=" px-5">
              <TouchableOpacity
                className=" mt-4 px-5 py-8 rounded-xl bg-white border border-customgray-100"
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <View className=" flex flex-row justify-between">
                  <Text className=" font-kanit text-2xl text-primaryblue-200">
                    ที่อยู่รับส่ง
                  </Text>
                  <MaterialIcons name="navigate-next" size={24} color="black" />
                </View>
                <View className=" mt-2 flex flex-row gap-x-4">
                  <View className=" flex justify-center items-center">
                    <MaterialIcons
                      name="location-pin"
                      size={24}
                      color="#0285df"
                    />
                  </View>
                  <View className=" w-full flex flex-row flex-1 pr-4">
                    <Text className=" font-kanitLight text-base">
                      {selectedAddress
                        ? `${
                            selectedAddress?.address +
                            " " +
                            selectedAddress?.subdistrict +
                            " " +
                            selectedAddress?.district +
                            " " +
                            selectedAddress?.province +
                            " " +
                            selectedAddress?.zipcode
                          }`
                        : "กรุณาเพิ่มที่อยู่"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* This service is not available in your area */}
            {isUnAvailableModalVisible === true || addressNotFound === true ? (
              <View className="px-5">
                {addressNotFound === true ? (
                  <View className=" w-full mt-5 gap-y-2 px-5 py-3 rounded-xl bg-white border border-customgray-100 h-[65vh] flex justify-center">
                    <View className=" flex flex-col gap-y-1">
                      <Text className=" text-center font-kanitLight">
                        ไม่พบที่อยู่ในการจัดส่ง
                      </Text>
                      <Text className="text-center font-kanitLight">
                        กรุณาเพิ่มที่อยู่ก่อนทำรายการ
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className=" w-full mt-5 gap-y-2 px-5 py-3 rounded-xl bg-white border border-customgray-100 h-[65vh] flex justify-center">
                    <View className=" flex flex-col gap-y-1">
                      <Text className=" text-center font-kanitLight">
                        บริการนี้ยังไม่สามารถให้บริการได้ในพื้นที่ของท่าน
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className=" w-full h-[71vh] justify-between">
                <View className=" px-5">
                  <View className=" mt-5 gap-y-2 flex flex-col px-5 py-3 rounded-xl bg-white border border-customgray-100">
                    <View className="">
                      <View className=" flex flex-row gap-x-4 justify-start items-center">
                        <Image
                          source={require("../../assets/images/icon.png")}
                          style={{ width: 24, aspectRatio: 1 }}
                        />
                        <Text className=" font-kanitLight flex-1">
                          ZMC สาขา {branchdata?.branch_name}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Machine Card */}
                  <View className=" mt-5 p-5 rounded-xl bg-white border border-customgray-100">
                    <View className=" flex flex-row justify-between">
                      <Text className=" font-kanit text-2xl text-primaryblue-200">
                        {isDryerOnly
                          ? "เลือกเครื่องอบผ้า"
                          : "เลือกเครื่องซักผ้า"}
                      </Text>
                    </View>
                    <View className=" mt-5 flex flex-row justify-between gap-x-4">
                      <View className=" flex flex-row gap-x-7 justify-start items-center">
                        <Image
                          source={isDryerOnly ? dryerImage : washmachineImage}
                          style={styles.machineImage}
                        />
                        <View className=" flex flex-col w-1/2">
                          <Text className=" font-kanit text-xl text-text-1">
                            {isDryerOnly ? "เครื่องอบผ้า" : "เครื่องซักผ้า"}
                          </Text>
                          <View className=" mt-2">
                            <Dropdown
                              data={isDryerOnly ? dryerdata : washerdata}
                              onChange={function (item: {
                                label: string;
                                value: string;
                              }): void {
                                setValue(item.value);
                                setIsFocus(false);
                                setAmount(1);
                              }}
                              labelField="label"
                              valueField="value"
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              value={value}
                              placeholder="กรุณาเลือก"
                              placeholderStyle={styles.dropdown}
                              style={styles.defaultselected}
                              selectedTextStyle={styles.dropdown}
                              itemTextStyle={styles.dropdown}
                              containerStyle={{ borderRadius: 10 }}
                              inputSearchStyle={{
                                borderRadius: 10,
                                fontFamily: "Kanit",
                                fontWeight: 300,
                                fontSize: 14,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                      <View className=" flex justify-center">
                        <Text className=" font-kanit text-2xl text-text-4">
                          {value === "" ? "" : `${totalPrice}฿`}
                        </Text>
                      </View>
                    </View>
                    <View className=" w-full flex flex-row justify-end items-center mt-3">
                      <TouchableOpacity
                        className=" px-2 py-[1px] bg-background-1"
                        onPress={() => {
                          if (amount === 1) return;
                          setAmount(amount - 1);
                        }}
                      >
                        <Text className=" text-center font-kanitThin text-base">
                          -
                        </Text>
                      </TouchableOpacity>
                      <View className=" px-2 border border-customgray-100">
                        <Text className=" text-center font-kanitLight text-base">
                          {amount}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className=" px-2 py-[1px] bg-background-1"
                        onPress={() => {
                          if (
                            Number(value) * (amount + 1) <= 21 &&
                            value !== "" &&
                            (isDryerOnly
                              ? (machineAvailbleAmount.Dryer.find(
                                  (item) => item.weight === Number(value)
                                )?.amount ?? 0) > amount
                              : (machineAvailbleAmount.Washer.find(
                                  (item) => item.weight === Number(value)
                                )?.amount ?? 0) > amount)
                          ) {
                            setAmount(amount + 1);
                          } else {
                            return;
                          }
                        }}
                      >
                        <Text className=" text-center font-kanitThin">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View className={` w-full bg-white px-8 mt-5`}>
                  <View className=" flex flex-col gap-y-4 pt-4">
                    {!isDryerOnly && (
                      <>
                        <Text className=" text-2xl font-kanit text-primaryblue-200">
                          เพิ่มเติม
                        </Text>
                        <View className=" flex flex-col gap-y-4">
                          <View className=" flex flex-row justify-between">
                            <View className=" flex flex-row relative h-fit">
                              <BouncyCheckbox
                                size={18}
                                fillColor={`${
                                  isCheckedDryer ? "#0285DF" : "#9AD2FF"
                                }`}
                                onPress={(isChecked: boolean) => {
                                  setIsCheckedDryer(isChecked);
                                }}
                              />
                              <Text className=" font-kanit text-lg text-text-4 -ml-2">
                                ต้องการใช้เครื่องอบ
                              </Text>
                              <View className=" absolute -right-9">
                                <Image
                                  source={require("../../assets/images/smallwasher.png")}
                                  style={{ height: 28, aspectRatio: 0.86 }}
                                />
                              </View>
                            </View>
                            <View className=" justify-center">
                              <Text className=" font-kanitLight text-base text-secondaryblue-300">
                                เริ่มต้น 50฿
                              </Text>
                            </View>
                          </View>
                          <View className=" flex flex-row justify-between">
                            <View className=" flex flex-row">
                              <BouncyCheckbox
                                size={18}
                                fillColor={`${
                                  isCheckedDetergents ? "#0285DF" : "#9AD2FF"
                                }`}
                                onPress={(isChecked: boolean) => {
                                  setIsCheckedDetergents(isChecked);
                                }}
                              />
                              <Text className="font-kanit text-lg text-text-4 -ml-2">
                                ต้องการน้ำยาซัก - ปรับผ้านุ่ม
                              </Text>
                              <View className=" absolute -right-10 -top-1">
                                <Image
                                  source={require("../../assets/images/softener.png")}
                                  style={{ height: 29, aspectRatio: 0.878 }}
                                />
                              </View>
                            </View>
                            <View>
                              <Text className=" font-kanitLight text-base text-secondaryblue-300">
                                เริ่มต้น 20฿
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View className=" py-2">
                          <Text className=" font-kanitLight text-sm text-customgray-400">
                            *หากต้องการใช้น้ำยาของตัวเองสามารถฝากมากับผ้าได้เลยครับ
                          </Text>
                          <Text className=" font-kanitLight text-sm text-customgray-400">
                            **ราคาจะมีการคำนวณอีกครั้งตามน้ำหนักเครื่องซักผ้า
                          </Text>
                        </View>
                      </>
                    )}

                    <View className=" w-full justify-center items-center gap-y-4">
                      <TouchableOpacity
                        className=" border border-primaryblue-300 w-full justify-center items-center rounded-md py-2"
                        onPress={() => {
                          handleModeChange();
                        }}
                      >
                        <Text className="font-kanit text-text-3 text-lg">
                          {isDryerOnly
                            ? "ต้องการซักพร้อมอบ"
                            : "ต้องการอบอย่างเดียว"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className=" border border-primaryblue-200 bg-primaryblue-200 w-full justify-center items-center rounded-md py-2"
                        onPress={() => {
                          // if (value === "") {
                          //   setIsWarningModalVisible(true);
                          //   return;
                          // }

                          // setIsSubmitting(true);

                          // if (isSuccess) {
                          //   router.push({
                          //     pathname: "/confirmation/[order_id]",
                          //     params: { order_id: "1" },
                          //   });
                          // }

                          router.replace({
                            pathname: "/confirmation/[order_id]",
                            params: { order_id: "1" },
                          });
                        }}
                      >
                        <Text className="font-kanit text-text-2 text-lg">
                          ดำเนินการต่อ
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className=" h-3"></View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DeliveryPage;

const styles = StyleSheet.create({
  dropdown: {
    color: "#696969",
    fontFamily: "Kanit",
    fontWeight: 300,
    fontSize: 14,
  },
  defaultselected: {
    backgroundColor: "#F9FAFF",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: 4,
    padding: 2,
    paddingLeft: 8,
  },
  button: {
    borderColor: "#71BFFF",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    textAlign: "center",
  },
  buttonText: {
    fontFamily: "Kanit",
    fontSize: 16,
    fontWeight: "400",
    color: "#0080D7",
    textAlign: "center",
  },
  machineImage: { width: 70, aspectRatio: 0.97 },
});
