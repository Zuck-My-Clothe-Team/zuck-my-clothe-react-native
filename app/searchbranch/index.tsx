import { GetAllBranch, getClosestBranch } from "@/api/branch.api";
import { getMachineByBranchID } from "@/api/machine.api";
import BranchBottomSheet from "@/components/searchbranch/BranchBottomSheet";
import BranchDetailBottomSheet from "@/components/searchbranch/BranchDetailBottomSheet";
import { IBranch } from "@/interface/branch.interface";
import { IMachineInBranch } from "@/interface/machinebranch.interface";
import { IRegion } from "@/interface/region.interface";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchBranchPage() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<IBranch[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [allBranchData, setAllBranchData] = useState<IBranch[]>([]);
  const [branchData, setBranchData] = useState<IBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<IBranch>();
  const [machineData, setMachineData] = useState<IMachineInBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<IRegion>();
  const [isSearchTabVisible, setIsSearchTabVisible] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);

  // MapView ref for programmatically controlling the map
  const mapRef = useRef<MapView>(null);

  // Fetch nearby branches
  const fetchBranches = useCallback(async () => {
    if (region?.latitude && region?.longitude) {
      try {
        const data: IBranch[] = await getClosestBranch({
          user_lat: region.latitude,
          user_lon: region.longitude,
        });

        setBranchData(data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [region]);

  useEffect(() => {
    fetchBranches();
  }, [location, region, fetchBranches, isSearchTabVisible]);

  const fetchMachineByBranchID = async (branch_id: string) => {
    try {
      const data = await getMachineByBranchID(branch_id);
      setMachineData(data);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    }
  };

  // Request location permission and get user's location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log(errorMsg);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, [errorMsg]);

  // Set initial region based on location
  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.032,
        longitudeDelta: 0.011,
      });
    }
  }, [location]);

  // Handle search functionality
  const handleSearch = useCallback(() => {
    if (searchKeyword === "") {
      setSearchResult(allBranchData);
    }
    setSearchResult(
      allBranchData.filter((branch) =>
        branch.branch_name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [allBranchData, searchKeyword]);

  // Center the map to the user's current location
  const goToUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.032,
        longitudeDelta: 0.011,
      });
    }
  };

  // go to branch region
  const goToBranchRegion = (branch: IBranch) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: branch.branch_lat - 0.0015,
        longitude: branch.branch_long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.005,
      });
    }
  };

  const getAllDataBranch = async () => {
    try {
      const result = await GetAllBranch();
      setBranchData(result);
      setAllBranchData(result);
      setSearchResult(result);
    } catch (error) {
      console.error("Error during fetch data (All Branch):", error);
    }
  };

  useMemo(async () => {
    await getAllDataBranch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword, handleSearch]);

  const handleBranchPress = (branch: IBranch) => {
    fetchBranches();
    goToBranchRegion(branch);
    fetchMachineByBranchID(branch.branch_id);
    setSelectedBranch(branch);
    setIsSearchTabVisible(false);
    setIsBottomSheetVisible(true);
    Keyboard.dismiss();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" className=" h-full" />;
  }

  return (
    <GestureHandlerRootView className="w-full h-full relative flex-1">
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        className="bg-primaryblue-300 h-full w-full relative"
      >
        {/* Header */}
        <View className="flex justify-center items-center py-3 px-7 relative">
          <TouchableOpacity
            className="absolute left-6"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color={"#faf9ff"} />
          </TouchableOpacity>
          <Text className="text-text-2 font-kanitMedium text-3xl">
            ค้นหาสาขา
          </Text>
        </View>

        {/* Search and Map */}
        <Pressable
          className="w-full h-full bg-white relative"
          onPressIn={() => {
            setIsSearchTabVisible(false);
            setIsBottomSheetVisible(false);
            Keyboard.dismiss();
          }}
        >
          {/* Search Input */}
          <View className="flex flex-row justify-center w-full absolute top-8 gap-x-4">
            <View className="w-[75%] ">
              <TextInput
                className="bg-background-1 rounded-lg px-4 py-2 text-lg font-kanit border border-[#d9d9d9]"
                placeholder="ค้นหาสาขา"
                onChangeText={(value) => {
                  setSearchKeyword(value);
                }}
                value={searchKeyword}
                clearButtonMode="always"
                keyboardType="default"
                returnKeyType="search"
                onPress={() => {
                  setIsSearchTabVisible(true);
                  setIsBottomSheetVisible(false);
                }}
              />
              {isSearchTabVisible && (
                <View className="h-fit max-h-[20rem]">
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    className="bg-background-1 w-full px-4 rounded-lg border border-customgray-300 overflow-hidden"
                  >
                    {searchResult.map((branch, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          handleBranchPress(branch);
                        }}
                        className="flex flex-row items-center justify-between py-3 pr-5 border-b border-[#d9d9d9]"
                      >
                        <Text
                          className="text-text-1 font-kanit text-lg"
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {branch.branch_name}
                        </Text>
                        <Feather
                          name="chevron-right"
                          size={24}
                          color="#373737"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View className=" flex">
              <TouchableOpacity
                onPress={goToUserLocation}
                className=" rounded-full"
              >
                <Image
                  source={require("../../assets/images/navigate.png")}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* MapView */}
          {location && (
            <MapView
              ref={mapRef}
              style={{ height: "100%", zIndex: -1 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              onPress={() => {
                setIsSearchTabVisible(false);
                setIsBottomSheetVisible(false);
              }}
              minZoomLevel={14}
              showsUserLocation={true}
              showsMyLocationButton={false}
              toolbarEnabled={false} // Disable toolbar as we use custom button
              mapPadding={{ top: 0, right: 0, bottom: 55, left: 0 }}
              onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
              {branchData.map((branch) => (
                <Marker
                  key={branch.branch_id}
                  icon={require("../../assets/images/mapPin.png")}
                  coordinate={{
                    latitude: branch.branch_lat,
                    longitude: branch.branch_long,
                  }}
                  onPress={() => {
                    handleBranchPress(branch);
                  }}
                />
              ))}
            </MapView>
          )}
        </Pressable>

        {/* Bottom Sheet */}
        <BranchBottomSheet
          branchData={branchData}
          userLocation={location}
          onPressBranch={handleBranchPress}
          onpressMachineInBranch={fetchMachineByBranchID}
          className=" absolute"
          isVisible={isBottomSheetVisible}
          setIsVisible={setIsBottomSheetVisible}
        />
        {selectedBranch !== undefined && (
          <BranchDetailBottomSheet
            userLocation={location}
            branchData={selectedBranch ?? ({} as IBranch)}
            machineData={machineData}
            className=" absolute"
            isVisible={isBottomSheetVisible}
            setIsVisible={setIsBottomSheetVisible}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
