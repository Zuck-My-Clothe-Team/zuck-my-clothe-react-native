import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { IBranch } from "@/interface/branch.interface";

const BranchBottomSheet = ({
  data,
  className,
  onPressBranch,
}: {
  data: IBranch[];
  className?: string;
  onPressBranch?: (branch: IBranch) => void;
  onpressUserLocation?: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    if (Platform.OS === "android") {
      return ["8%", "20%", "50%", "70%"];
    }
    return ["8.25%", "20%", "50%", "70%"];
  }, []);

  const handleSheetChange = useCallback((index: any) => {
    // console.log("handleSheetChange", index);
  }, []);

  const SnapBottomSheetToIndex = useCallback((snapIndex: number) => {
    bottomSheetRef.current?.snapToIndex(snapIndex);
  }, []);

  return (
    <>
      {/* BottomSheet component */}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChange}
        index={1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        containerStyle={{ position: "relative" }}
        backgroundStyle={{
          backgroundColor: "#2594e1",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleIndicatorStyle={{ backgroundColor: "#E3E3E3", width: 76 }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>สาขาใกล้คุณ</Text>
        </View>
        <BottomSheetFlatList
          data={data}
          renderItem={({ item }: { item: IBranch }) => (
            <View>
              <TouchableOpacity
                style={styles.flatListContainer}
                onPress={() => {
                  if (onPressBranch) {
                    onPressBranch(item);
                    SnapBottomSheetToIndex(0);
                  }
                }}
              >
                <View>
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={{ width: 58, height: 58 }}
                  />
                </View>
                <View>
                  <Text style={styles.branchTitle}>สาขา {item.branch_name}</Text>
                  <Text style={styles.branchDistance}>
                    ระยะทาง{" "}
                    {item.distance >= 0.5
                      ? `${item.distance.toFixed(1)} กม.`
                      : `${(item.distance * 1000).toFixed(1)} ม.`}
                  </Text>
                  <Text style={styles.branchDetail}>{item.branch_detail}</Text>
                </View>
              </TouchableOpacity>
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
    width: "100%",
    backgroundColor: "#2594e1",
    paddingTop: 2,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontFamily: "Kanit",
    fontSize: 20,
    color: "#ffffff",
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
    width: "100%",
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

export default BranchBottomSheet;
