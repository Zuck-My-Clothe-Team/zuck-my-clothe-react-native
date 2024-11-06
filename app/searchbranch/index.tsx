import { GetAllBranch, getClosestBranch } from "@/api/branch.api";
import BranchBottomSheet from "@/components/searchbranch/BranchBottomSheet";
import { IBranch } from "@/interface/branch.interface";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function SearchBranchPage() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<IBranch[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [branchData, setBranchData] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<IRegion>();
  const [isSearchTabVisible, setIsSearchTabVisible] = useState(false);

  // MapView ref for programmatically controlling the map
  const mapRef = useRef<MapView>(null);

  // Fetch nearby branches
  useEffect(() => {
    const fetchBranches = async () => {
      if (location?.coords) {
        try {
          const data = await getClosestBranch({
            user_lat: location.coords.latitude,
            user_lon: location.coords.longitude,
          });
          setBranchData(data);
        } catch (error) {
          console.error("Failed to fetch branches:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBranches();
  }, [location, region]);

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
  const handleSearch = (searchWord: string) => {
    setSearchKeyword(searchWord);
    if (searchWord === "") {
      setSearchResult(branchData);
    } else {
      setSearchResult(
        branchData.filter((branch) =>
          branch.branch_name.toLowerCase().includes(searchWord.toLowerCase())
        )
      );
    }
  };

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
        latitude: branch.branch_lat,
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
      setSearchResult(result);
    } catch (error) {
      console.error("Error during fetch data (All Branch):", error);
    }
  };

  useMemo(async () => {
    await getAllDataBranch();
  }, []);

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
          onPressIn={Keyboard.dismiss}
        >
          {/* Search Input */}
          <View className="flex flex-row justify-center w-full absolute top-8 gap-x-4">
            <View className="w-[75%]">
              <TextInput
                className="bg-background-1 rounded-lg px-4 py-2 text-lg font-kanit border border-[#d9d9d9]"
                placeholder="ค้นหาสาขา"
                onChangeText={handleSearch}
                value={searchKeyword}
                clearButtonMode="always"
                keyboardType="default"
                returnKeyType="search"
              />
              {searchKeyword && (
                <View className="h-fit max-h-[20rem]">
                  <ScrollView className="bg-background-1 w-full px-4 rounded-lg border border-customgray-300 overflow-hidden">
                    {searchResult.map((branch, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          goToBranchRegion(branch);
                        }}
                        className="flex flex-row items-center justify-between py-3 border-b border-[#d9d9d9] overflow-hidden"
                      >
                        <Text className="text-black font-kanit text-lg">
                          {branch.branch_name}
                        </Text>
                        <Feather name="chevron-right" size={24} color="black" />
                      </TouchableOpacity>
                    ))}
                    {searchResult.map((branch, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          goToBranchRegion(branch);
                        }}
                        className="flex flex-row items-center justify-between py-2 border-b border-[#d9d9d9] overflow-hidden"
                      >
                        <Text className="text-black font-kanit text-lg">
                          {branch.branch_name}
                        </Text>
                        <Feather name="chevron-right" size={24} color="black" />
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
              showsUserLocation={true}
              toolbarEnabled={false} // Disable toolbar as we use custom button
              mapPadding={{ top: 0, right: 0, bottom: 55, left: 0 }}
              onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
              {branchData.map((branch, index) => (
                <Marker
                  key={index}
                  icon={require("../../assets/images/mapPin.png")}
                  coordinate={{
                    latitude: branch.branch_lat,
                    longitude: branch.branch_long,
                  }}
                  onPress={() => goToBranchRegion(branch)}
                />
              ))}
            </MapView>
          )}
        </Pressable>

        {/* Custom "My Location" Button */}
        {/* Bottom Sheet */}
        <BranchBottomSheet data={branchData} onPressBranch={goToBranchRegion} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
