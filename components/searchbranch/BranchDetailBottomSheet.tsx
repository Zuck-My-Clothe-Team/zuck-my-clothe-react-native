import { IBranch } from "@/interface/branch.interface";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Location from "expo-location";
import { getDistance } from 'geolib';

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

  const distance = useMemo(() => {
    if (userLocation) {
      return getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: branchData.branch_lat, longitude: branchData.branch_long }
      );
    }
    return 0;
  }, [userLocation, branchData]);

  useEffect(() => {
    console.log("distance", distance);
    console.log("userLocation", userLocation);
    console.log("branchData", branchData);
  }, [branchData, distance, userLocation]);

  const snapPoints = useMemo(() => {
    return ["50%", "70%"];
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
    console.log("isVisible", isVisible);
  }, [isVisible]);

  // const SnapBottomSheetToIndex = useCallback((snapIndex: number) => {
  //   bottomSheetRef.current?.snapToIndex(snapIndex);
  // }, []);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, [branchData, machineData]);

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
        <View className=" flex flex-col py-2 px-8">
          <View
            style={{ columnGap: 20}}
            className=" flex flex-row justify-start items-center"
          >
            <View>
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: 56, height: 56 }}
              />
            </View>
            <View style={{ width: "80%" }}>
              <Text style={styles.headerText}>
                สาขา {branchData.branch_name}
              </Text>
              <Text style={styles.branchDistance}>
                ระยะทาง{" "}
                {distance <= 500
                  ? `${(distance).toFixed(1)} เมตร`
                  : `${(distance / 1000).toFixed(1)} กิโลเมตร`}
              </Text>
            </View>
          </View>
          <View>
            <Text>{branchData.branch_detail}</Text>
          </View>
        </View>
        <BottomSheetFlatList
          data={machineData}
          horizontal={true}
          renderItem={({ item }: { item: IMachineInBranch }) => (
            <View style={styles.flatListContainer}>
              <View>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 58, height: 58 }}
                />
              </View>
              <View>
                <Text style={styles.branchTitle}>สาขา {item.machine_type}</Text>
              </View>
            </View>
          )}
          className="bg-white"
        />
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f9faff",
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3",
    paddingHorizontal: 20,
    paddingRight: 100,
    paddingVertical: 10,
    columnGap: 20,
  },
  branchTitle: {
    fontFamily: "Kanit",
    fontWeight: "400",
    fontSize: 18,
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
    fontWeight: "300",
    fontSize: 13,
    color: "#0080d7",
  },
});

export default BranchDetailBottomSheet;