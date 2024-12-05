import { getAddressById } from "@/api/address.api";
import { getClosestBranch } from "@/api/branch.api";
import { getAvailableMachineByBranchID } from "@/api/machine.api";
import { createNewOrder } from "@/api/order.api";
import { getUserAddress } from "@/api/useraddress.api";
import CustomModal from "@/components/modal/CustomModal";
import { useAuth } from "@/context/auth.context";
import { IBranch } from "@/interface/branch.interface";
import { TWeight } from "@/interface/machinebranch.interface";
import { INewOrder, ServiceType } from "@/interface/order.interface";
import { IUserAddress } from "@/interface/userdetail.interface";
import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, SplashScreen, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

const washmachineImage = require("../../assets/images/washmachine.png");
const dryerImage = require("../../assets/images/dryer.png");

SplashScreen.preventAutoHideAsync();

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
  const [isPhoneNumberModalVisible, setIsPhoneNumberModalVisible] =
    useState(false);

  const [newOrder, setNewOrder] = useState<INewOrder>();
  const [note, setNote] = useState("");

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
        order_details: [],
        order_note: "",
        user_id: userData?.user_id || "",
        zuck_onsite: false,
      });
      // setIsSubmitting(false);
    }
  }, [branchdata, selectedAddress, userData?.user_id]);

  async function addOrderDetails(): Promise<INewOrder | undefined> {
    let prevOrder = newOrder;

    if (prevOrder) {
      prevOrder = {
        ...prevOrder,
        order_details: [
          ...prevOrder.order_details,
          ...Array.from({ length: amount }, () => ({
            machine_serial: null,
            service_type: isDryerOnly
              ? ServiceType.Drying
              : ServiceType.Washing,
            weight: Number(value) as TWeight,
          })),
          {
            machine_serial: null,
            service_type: ServiceType.Pickup,
            weight: 0,
          },
          {
            machine_serial: null,
            service_type: ServiceType.Delivery,
            weight: 0,
          },
        ],
      };

      if (isDryerOnly) {
      } else {
      }

      if (isCheckedDryer && Number(value) * amount <= 21) {
        prevOrder = {
          ...prevOrder,
          order_details: [
            ...prevOrder.order_details,
            {
              machine_serial: null,
              service_type: ServiceType.Drying, // Add the specific details for the new element
              weight: (Number(value) * amount) as TWeight, // Replace with dynamic weight
            },
          ],
        };
      }

      if (isCheckedDetergents) {
        prevOrder = {
          ...prevOrder,
          order_details: [
            ...prevOrder.order_details,
            {
              machine_serial: null,
              service_type: ServiceType.Agents, // Add the specific details for the new element
              weight: 0,
            },
          ],
        };
      }

      if (note !== "") {
        prevOrder = {
          ...prevOrder,
          order_note: note,
        };
      }
      setNewOrder(prevOrder);
      return prevOrder;
    }
  }

  async function createOrder(order: INewOrder) {
    if (order) {
      try {
        const data = await createNewOrder(order);
        // setIsSuccess(true);
        // setIsSubmitting(false);
        // console.log("New order created:", data);
        router.replace({
          pathname: "/confirmation/[order_id]",
          params: { order_id: data.order_header_id },
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 203) {
            setIsWarningModalVisible(true);
          }
        }
      } finally {
        // setIsSubmitting(false);
      }
    }
  }

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
      // setIsSubmitting(false);
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          onTouchCancel={Keyboard.dismiss}
        >
          {/* Warning Modal */}
          <CustomModal
            visible={isWarningModalVisible}
            setVisible={setIsWarningModalVisible}
            icon={<Feather name="info" size={52} color="#71bfff" />}
            text={["กรุณาเลือกน้ำหนักเครื่องซักผ้า"]}
          />

          <CustomModal
            visible={isPhoneNumberModalVisible}
            setVisible={setIsPhoneNumberModalVisible}
            icon={<FontAwesome6 name="phone" size={34} color="#45d66b" />}
            text={["กรุณาเพิ่มเบอร์โทรศัพท์"]}
            onPress={() => {
              router.push("/(profile)/edit_profile");
            }}
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
                    <Ionicons name="close" size={30} color={"#71BFFF"} />
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
                <Ionicons name="arrow-back" size={30} color={"#71BFFF"} />
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
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
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
              {isUnAvailableModalVisible === true ||
              addressNotFound === true ? (
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
                <View className=" w-full justify-between">
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
                                  fontFamily: "Kanit_300Light",
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
                </View>
              )}
            </View>
          </ScrollView>

          {isUnAvailableModalVisible === true || addressNotFound === true ? (
            <></>
          ) : (
            <View className={` w-full bg-white`}>
              <View className=" flex flex-col gap-y-4">
                <View className=" px-8 flex flex-col gap-y-4 pt-4">
                  {!isDryerOnly && (
                    <>
                      <Text className=" text-2xl font-kanit text-primaryblue-200">
                        เพิ่มเติม
                      </Text>
                      <View className=" flex flex-col gap-y-4">
                        <View className="flex flex-row justify-between">
                          <TouchableOpacity
                            className="flex flex-row relative h-fit"
                            onPress={() => setIsCheckedDryer(!isCheckedDryer)}
                          >
                            <BouncyCheckbox
                              size={18}
                              fillColor={`${
                                isCheckedDryer ? "#0285DF" : "#9AD2FF"
                              }`}
                              isChecked={isCheckedDryer}
                              onPress={(isChecked: boolean) =>
                                setIsCheckedDryer(isChecked)
                              }
                            />
                            <Text className="font-kanit text-lg text-text-4 -ml-2">
                              ต้องการใช้เครื่องอบ
                            </Text>
                            <View className="absolute -right-9">
                              <Image
                                source={require("../../assets/images/smallwasher.png")}
                                style={{ height: 28, aspectRatio: 0.86 }}
                              />
                            </View>
                          </TouchableOpacity>
                          <View className="justify-center">
                            <Text className="font-kanitLight text-base text-secondaryblue-300">
                              เริ่มต้น 50฿
                            </Text>
                          </View>
                        </View>
                        <View className=" flex flex-row justify-between">
                          <TouchableOpacity
                            className=" flex flex-row"
                            onPress={() =>
                              setIsCheckedDetergents(!isCheckedDetergents)
                            }
                          >
                            <BouncyCheckbox
                              size={18}
                              fillColor={`${
                                isCheckedDetergents ? "#0285DF" : "#9AD2FF"
                              }`}
                              onPress={(isChecked: boolean) => {
                                setIsCheckedDetergents(isChecked);
                              }}
                              isChecked={isCheckedDetergents}
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
                          </TouchableOpacity>
                          <View>
                            <Text className=" font-kanitLight text-base text-secondaryblue-300">
                              เริ่มต้น 20฿
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                <View className="px-8">
                  <View className=" py-3 flex flex-row items-start gap-x-4">
                    <Text className=" font-kanit text-xl text-primaryblue-200 mt-1">
                      Note :{" "}
                    </Text>
                    <TextInput
                      className=" flex-1 font-kanitLight text-base text-text-4"
                      placeholder="กรอกโน้ตถึงร้านซักผ้า"
                      multiline={true}
                      onChangeText={(text) => setNote(text)}
                    />
                  </View>
                </View>

                <View className=" px-8 w-full justify-center items-center gap-y-4">
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
                    onPress={async () => {
                      if (value === "") {
                        setIsWarningModalVisible(true);
                        return;
                      }

                      if (userData?.phone === "" || userData?.phone === null) {
                        setIsPhoneNumberModalVisible(true);
                        return;
                      }

                      const order = await addOrderDetails();
                      console.log("Order:", order);
                      if (order) {
                        await createOrder(order);
                      }
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
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default DeliveryPage;

const styles = StyleSheet.create({
  dropdown: {
    color: "#696969",
    fontFamily: "Kanit_300Light",
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
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "#0080D7",
    textAlign: "center",
  },
  machineImage: { width: 70, aspectRatio: 0.97 },
});
