import { getBranchByID } from "@/api/branch.api";
import { IBranch, IUserReviews } from "@/interface/branch.interface";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import Location from "expo-location";
import { getDistance } from "geolib";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const BranchDetailBottomSheet = ({
  branchData,
  machineData,
  userLocation,
  // userReviewData,
  className,
  isVisible,
  setIsVisible,
}: {
  branchData: IBranch;
  machineData: IMachineInBranch[];
  // userReviewData: any;
  userLocation: Location.LocationObject | null;
  className?: string;
  isVisible?: boolean;
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sortedMachineData, setSortedMachineData] = useState<
    IMachineInBranch[]
  >([]);

  const [userReviewData, setUserReviewData] = useState<IUserReviews[] | null>(
    []
  );

  const distance = useMemo(() => {
    if (userLocation) {
      return getDistance(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        { latitude: branchData.branch_lat, longitude: branchData.branch_long }
      );
    }
    return 0;
  }, [userLocation, branchData]);

  const snapPoints = useMemo(() => {
    return ["50%", "75%"];
  }, []);

  const handleSheetChange = useCallback(
    (index: any) => {
      // bottomSheetRef.current?.snapToIndex(0);
      if (setIsVisible && index && index !== 0) {
        setIsVisible(true);
      }
    },
    [setIsVisible]
  );

  useEffect(() => {
    if (!isVisible) {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // const SnapBottomSheetToIndex = useCallback((snapIndex: number) => {
  //   bottomSheetRef.current?.snapToIndex(snapIndex);
  // }, []);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, [branchData, machineData]);

  useEffect(() => {
    console.log(branchData.user_reviews);
  }, [branchData]);

  useMemo(() => {
    const fetchReviewData = async () => {
      const branch = await getBranchByID(branchData.branch_id);
      const reviewData = branch.user_reviews;
      setUserReviewData(reviewData);
      console.log(reviewData);
    };
    fetchReviewData();
  }, [branchData.branch_id]);

  useMemo(() => {
    setSortedMachineData(
      machineData
        .sort((a, b) => a.machine_label.localeCompare(b.machine_label))
        .map((machine) => {
          const newMachine = { ...machine };
          newMachine.machine_label = newMachine.machine_label.replace(
            "เครื่องซักที่ ",
            ""
          );

          newMachine.machine_label = newMachine.machine_label.replace(
            "เครื่องอบที่ ",
            ""
          );
          return newMachine;
        })
    );
  }, [machineData]);

  // useEffect(() => {
  //   console.log(machineData);
  // }, [machineData]);

  interface EncryptFunction {
    (text: string): string;
  }

  const encrypt: EncryptFunction = (text) => {
    if (text.length <= 2) return text;
    return text[0] + "*".repeat(text.length - 2) + text[text.length - 1];
  };

  return (
    <>
      {/* BottomSheet component */}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChange}
        enablePanDownToClose={true}
        index={1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        containerStyle={{ position: "relative" }}
        backgroundStyle={{
          backgroundColor: "#f9faff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleIndicatorStyle={{ backgroundColor: "#E3E3E3", width: 76 }}
      >
        <View className=" flex flex-col py-2 px-8" style={{ rowGap: 12 }}>
          <View
            style={{ columnGap: 20 }}
            className=" flex flex-row justify-start items-center"
          >
            <View>
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: 56, height: 56 }}
              />
            </View>
            <View style={{ width: "80%" }}>
              <Text style={styles.branchTitle}>
                สาขา {branchData.branch_name}
              </Text>
              <Text style={styles.branchDistance}>
                ระยะทาง{" "}
                {distance <= 500
                  ? `${distance.toFixed(1)} เมตร`
                  : `${(distance / 1000).toFixed(1)} กิโลเมตร`}
              </Text>
            </View>
          </View>
          <View>
            <Text className="" style={styles.branchDetail}>
              {branchData.branch_detail}
            </Text>
          </View>
        </View>
        <View className=" w-full" style={{ paddingLeft: 28, marginTop: 10 }}>
          {sortedMachineData.length !== 0 ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                // paddingHorizontal: 10,
                paddingRight: 30,
                paddingVertical: 10,
                shadowColor: "#bde2ff",
                shadowOffset: {
                  width: 0,
                  height: 50,
                },
                shadowOpacity: 0.35,
              }}
            >
              {sortedMachineData.map((machine) => (
                <View
                  key={machine.machine_serial}
                  style={{
                    padding: 10,
                    paddingRight: 10,
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                    borderRightWidth: 1,
                    borderRightColor: "#E3E3E3",
                  }}
                >
                  <View className=" justify-center">
                    <Image
                      source={require("@/assets/images/WashingMachine.png")}
                      style={{ width: 49, height: 49 }}
                    />
                  </View>
                  <View className="">
                    <Text style={styles.machineDetail}>
                      {machine.machine_type === "Washer"
                        ? "เครื่องซัก"
                        : "เครื่องอบ"}{" "}
                      {machine.weight} Kg.
                    </Text>
                    <Text style={[styles.branchDistance, { marginBottom: 20 }]}>
                      {"หมายเลข"} {machine.machine_label}
                    </Text>
                    {machine.is_active === true ? (
                      <View
                        className=" rounded-full"
                        style={{
                          backgroundColor: "#B0FFC8",
                          width: 70,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          className=" text-center font-kanit"
                          style={{ color: "#219506" }}
                        >
                          ว่าง
                        </Text>
                      </View>
                    ) : (
                      <View
                        className=" rounded-full"
                        style={{
                          backgroundColor: "#FFC2BB",
                          paddingVertical: 2,
                        }}
                      >
                        <Text className=" text-center font-kanit text-customred-1">
                          กำลังทำงาน
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              style={{ fontFamily: "Kanit", fontSize: 18, color: "#F0507E" }}
            >
              สาขานี้ยังไม่มีเครื่องซัก/อบผ้า!
            </Text>
          )}
        </View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 30 }}>
          <Text
            style={{
              color: "#0285DF",
              fontFamily: "Kanit",
              fontSize: 19,
              fontWeight: 400,
            }}
          >
            {"รีวิว"} {`(${userReviewData?.length})`}
          </Text>
          <ScrollView>
            {userReviewData?.map((review) => (
              <View
                key={review.review_comment}
                style={{
                  marginTop: 10,
                  backgroundColor: "#F9FAFF",
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 20,
                    rowGap: 10,
                  }}
                >
                  <View
                    className="flex flex-row items-center"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Left side: Name and Profile Image */}
                    <View
                      className="flex flex-row items-center"
                      style={{ columnGap: 10 }}
                    >
                      <Image
                        source={require("../../assets/images/BsPersonCircle.png")}
                        style={{ width: 34, aspectRatio: 1 }}
                      />
                      <Text
                        style={{
                          fontFamily: "Kanit",
                          fontSize: 16,
                          fontWeight: "400",
                        }}
                      >
                        {/* {encrypt(review.firstname)} */}
                        {review.firstname}
                      </Text>
                    </View>

                    {/* Right side: Star Rating */}
                    <View className="flex flex-row">
                      {/* {Array.from({ length: review.star_rating }, (_, index) => (
                      <FontAwesome key={index} name="star" size={16} color="#FFE286" />
                    ))} */}
                      <FontAwesome name="star" size={22} color="#FFE286" />
                      <Text
                        style={{
                          fontFamily: "Kanit",
                          fontSize: 16,
                          fontWeight: "400",
                          marginLeft: 4,
                          color: "373737",
                        }}
                      >
                        {review.star_rating.toFixed(1)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Kanit",
                          fontSize: 14,
                          fontWeight: "300",
                          marginLeft: 3,
                          color: "#696969",
                        }}
                      >
                        /5
                      </Text>
                    </View>
                  </View>

                  {/* Review Comment */}
                  <View
                    className="bg-white"
                    style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                  >
                    <Text
                      style={{
                        fontFamily: "Kanit",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#696969",
                      }}
                    >
                      {review.review_comment}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "90%",
    backgroundColor: "#f9faff",
    paddingTop: 2,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    columnGap: 20,
  },
  headerText: {
    fontFamily: "Kanit",
    fontSize: 20,
    color: "#373737",
    // backgroundColor: "#fe0000",
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: "20%", // Adjust this percentage to place it relative to BottomSheet's starting position
    zIndex: 10,
  },
  flatListContainer: {
    backgroundColor: "#f9faff",
  },
  branchTitle: {
    fontFamily: "Kanit",
    fontWeight: "400",
    fontSize: 20,
    color: "#373737",
  },
  branchDistance: {
    fontFamily: "Kanit",
    fontWeight: "300",
    fontSize: 15,
    color: "#696969",
  },
  branchDetail: {
    fontFamily: "Kanit",
    fontWeight: "400",
    fontSize: 16,
    color: "#0080d7",
  },
  machineDetail: {
    fontFamily: "Kanit",
    fontWeight: "400",
    fontSize: 16,
    color: "#71BFFF",
  },
});

export default BranchDetailBottomSheet;
