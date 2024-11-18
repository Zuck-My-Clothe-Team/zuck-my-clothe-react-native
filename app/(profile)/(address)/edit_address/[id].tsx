import {
  deleteAddress,
  getAddressById,
  updateAddress,
} from "@/api/address.api";
import LoadingBubble from "@/components/auth/Loading";
import { IAddress } from "@/interface/address.interface";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IRegion } from "@/interface/region.interface";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocationContext } from "@/context/location.context";
import { SafeAreaView } from "react-native-safe-area-context";

const EditAddressPage: React.FC = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { latitude, longitude, setLatitude, setLongitude } =
    useLocationContext();
  const [addressData, setAddressData] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [region, setRegion] = useState<IRegion>();

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let isMounted = true;

    if (latitude && longitude) {
      if (isMounted) {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.005,
        });
        setAddressData((prevData) => {
          if (
            prevData &&
            (prevData.lat !== latitude || prevData.long !== longitude)
          ) {
            return {
              ...prevData,
              lat: latitude ?? prevData.lat,
              long: longitude ?? prevData.long,
            };
          }
          return prevData;
        });
      }
    } else if (addressData) {
      if (isMounted) {
        setRegion({
          latitude: addressData.lat,
          longitude: addressData.long,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.005,
        });
      }
    }

    return () => {
      isMounted = false;
      setLatitude(null);
      setLongitude(null);
    };
  }, [latitude, longitude, addressData, setLatitude, setLongitude]);

  const fetchAddress = useCallback(async (address_id: string) => {
    try {
      setLoading(true);
      const result = await getAddressById(address_id);
      if (!result || result.status !== 200)
        throw new Error("Cannot fetch address");
      const data: IAddress = result.data;
      setAddressData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleChange = (name: string, value: string) => {
    if (addressData) {
      setAddressData({ ...addressData, [name]: value });
    }
  };

  const onDelete = useCallback(async (address_id: string) => {
    try {
      const result = await deleteAddress(address_id);
      if (!result || result.status !== 200)
        throw new Error("Cannot delete address");
      router.back();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onFinish = useCallback(
    async (values: IAddress) => {
      try {
        if (!values) throw new Error("Cannot update address");
        const result = await updateAddress(values);
        if (!result || result.status !== 200)
          throw new Error("Cannot update address");
        router.back();
      } catch (error) {
        console.error(error);
      }
    },
    [addressData]
  );

  useMemo(async () => {
    await fetchAddress(id);
  }, [fetchAddress, id]);

  if (loading) return <LoadingBubble />;

  return (
    <SafeAreaView style={{ backgroundColor: "#0285DF" }}>
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
          <Text style={styles.textHeader}>แก้ไขที่อยู่</Text>
        </View>
      </View>
      <ScrollView
        style={styles.bodyBg}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.bodyText}>กรอกที่อยู่ในการใช้บริการซัก-ส่งผ้า</Text>
        <View style={styles.inputForm}>
          <View>
            <Text style={styles.labelInputText}>ที่อยู่</Text>
            <TextInput
              style={styles.textInput}
              placeholder="ที่อยู่"
              value={addressData?.address}
              onChangeText={(text) => handleChange("address", text)}
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.labelInputText}>ไปรษณีย์ 5 หลัก</Text>
            <TextInput
              style={styles.textInput}
              placeholder="รหัสไปรษณีย์ 5 หลัก"
              value={addressData?.zipcode}
              maxLength={5}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                handleChange("zipcode", numericText);
              }}
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.labelInputText}>แขวง / ตำบล</Text>
            <TextInput
              style={styles.textInput}
              placeholder="แขวง / ตำบล"
              value={addressData?.subdistrict}
              onChangeText={(text) => handleChange("subdistrict", text)}
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.labelInputText}>เขต/อำเภอ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="เขต/อำเภอ"
              value={addressData?.district}
              onChangeText={(text) => handleChange("district", text)}
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.labelInputText}>จังหวัด</Text>
            <TextInput
              style={styles.textInput}
              placeholder="จังหวัด"
              value={addressData?.province}
              onChangeText={(text) => handleChange("province", text)}
              autoCapitalize="none"
            />
          </View>
        </View>
        <TouchableOpacity
          style={{ maxHeight: "40%" }}
          onPress={() => {
            router.push({
              pathname: "/edit_address/map",
              params: {
                lat: addressData?.lat,
                long: addressData?.long,
              },
            });
          }}
        >
          <View style={styles.mapHeaderSection}>
            <Text style={styles.mapHeaderText}>ปักหมุดที่อยู่บนแผนที่</Text>
          </View>
          <MapView
            ref={mapRef}
            style={{ height: "100%", zIndex: -1 }}
            provider={PROVIDER_GOOGLE}
            region={region}
            minZoomLevel={14}
            mapPadding={{ top: 0, right: 0, bottom: 55, left: 0 }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: addressData?.lat ?? 0,
                longitude: addressData?.long ?? 0,
              }}
            />
          </MapView>
        </TouchableOpacity>

        <View style={{ marginTop: 70 }}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={async () => {
              await onDelete(id);
            }}
          >
            <Text style={styles.deleteButtonText}>ลบที่อยู่</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onFinish(addressData as IAddress)}
          >
            <Text style={styles.saveButtonText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  textHeader: {
    fontSize: 28,
    color: "#F9FAFF",
    fontFamily: "Kanit",
    fontWeight: "500",
  },
  bodyBg: {
    backgroundColor: "#F9FAFF",
    padding: 20,
    height: "100%",
  },
  scrollViewContent: {
    paddingBottom: 300,
  },
  bodyText: {
    fontSize: 20,
    fontFamily: "Kanit",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#0080D7",
  },
  labelInputText: {
    fontSize: 16,
    fontFamily: "Kanit",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#0080D7",
  },
  inputForm: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
    rowGap: 15,
  },
  textInput: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderColor: "#71BFFF",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  mapHeaderSection: {
    marginTop: 10,
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#50A4DF",
  },
  mapHeaderText: {
    fontSize: 20,
    fontFamily: "Kanit",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F9FAFF",
  },
  deleteButton: {
    marginTop: 20,
    paddingHorizontal: 26,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F0507E",
    backgroundColor: "#F9FAFF",
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "Kanit",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F0507E",
    textAlign: "center",
  },
  saveButton: {
    marginTop: 20,
    paddingHorizontal: 26,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#2594E1",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Kanit",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#F9FAFF",
    textAlign: "center",
  },
});

export default EditAddressPage;
