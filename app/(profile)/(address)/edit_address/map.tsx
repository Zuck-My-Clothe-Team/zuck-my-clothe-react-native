import { useLocationContext } from "@/context/location.context";
import { IRegion } from "@/interface/region.interface";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const MapViewPage = () => {
  const location = useLocationContext();

  const { lat, long } = useLocalSearchParams<{
    lat: string;
    long: string;
  }>();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<IRegion>({
    latitude: parseFloat(lat),
    longitude: parseFloat(long),
    latitudeDelta: 0.0035,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView>(null);

  // Request location permission and get user's location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log(errorMsg);
        return;
      }
    })();
  }, [errorMsg]);

  return (
    <SafeAreaView style={{ backgroundColor: "#0285DF", flex: 1 }}>
      <View style={styles.headerBg}>
        <AntDesign
          name="arrowleft"
          size={24}
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          color="#71BFFF"
          onPress={() => {
            router.back();
          }}
        />
        <View style={styles.header}>
          <Text style={styles.textHeader}>ปักหมุดที่อยู่</Text>
        </View>
      </View>
      <Pressable
        onPressIn={() => {
          Keyboard.dismiss();
        }}
        style={styles.mapViewSection}
      >
        <MapView
          ref={mapRef}
          style={{ height: "100%", zIndex: -1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          minZoomLevel={14}
          showsUserLocation={true}
          toolbarEnabled={false} // Disable toolbar as we use custom button
          mapPadding={{ top: 0, right: 0, bottom: 55, left: 0 }}
          onRegionChangeComplete={(newRegion) => {
            setRegion(newRegion);
          }}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="คุณอยู่ที่นี่"
            description="คลิกเพื่อปักหมุด"
          />
        </MapView>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              location.setLatitude(region.latitude);
              location.setLongitude(region.longitude);
              router.back();
            }}
          >
            <Text style={styles.saveButtonText}>ยืนยันที่อยู่</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerBg: {
    position: "relative",
    backgroundColor: "#0285DF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mapViewSection: {
    height: "100%",
    zIndex: -1,
    position: "relative",
    flex: 1,
  },
  textHeader: {
    fontSize: 28,
    color: "#F9FAFF",
    fontFamily: "Kanit_500Medium",
    fontWeight: "500",
  },
  bottomSection: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: 24,
  },
  saveButton: {
    paddingHorizontal: 26,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#2594E1",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Kanit_400Regular",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F9FAFF",
    textAlign: "center",
  },
});
export default MapViewPage;
