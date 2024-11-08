import { IBranch } from "@/interface/branch.interface";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BranchBottomSheet = ({
  data,
  className,
  onPressBranch,
  onpressMachineInBranch,
  isVisible,
  setIsVisible,
}: {
  data: IBranch[];
  className?: string;
  onPressBranch?: (branch: IBranch) => void;
  onpressMachineInBranch?: (branch_id: string) => void;
  onpressUserLocation?: () => void;
  isVisible?: boolean;
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    if (Platform.OS === "android") {
      return ["8%", "20%", "50%", "70%"];
    }
    return ["8.25%", "20%", "50%", "70%"];
  }, []);

  const handleSheetChange = useCallback((index: any) => {
    if (setIsVisible && index && index !== 0) {
      setIsVisible(true);
    }
  }, [setIsVisible]);

  useEffect(() => {
    if (!isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isVisible]);

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
        <Pressable style={styles.headerContainer} onPress={() => bottomSheetRef.current?.snapToIndex(2)}>
          <Text style={styles.headerText}>สาขาใกล้คุณ</Text>
        </Pressable>
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
                    if (onpressMachineInBranch) {
                      onpressMachineInBranch(item.branch_id);
                    }
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
                  <Text style={styles.branchTitle}>
                    สาขา {item.branch_name}
                  </Text>
                  <Text style={styles.branchDistance}>
                    ระยะทาง{" "}
                    {item.distance >= 0.5
                      ? `${item.distance.toFixed(1)} กิโลเมตร`
                      : `${(item.distance * 1000).toFixed(1)} เมตร`}
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
    fontFamily: "kanit",
    fontSize: 20,
    color: "#ffffff",
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: "20%",
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
