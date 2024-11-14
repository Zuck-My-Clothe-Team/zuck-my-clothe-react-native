import { getOwnAddress } from "@/api/address.api";
import LoadingBubble from "@/components/auth/Loading";
import { IAddress } from "@/interface/address.interface";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AddressPage = () => {
  const [addressData, setAddressData] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAddress = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getOwnAddress();
      if (!result || result.status !== 200)
        throw new Error("Cannot fetch address");
      const data: IAddress[] = result.data;
      setAddressData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [fetchAddress])
  );

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
          <Text style={styles.textHeader}>ที่อยู่</Text>
        </View>
      </View>

      <ScrollView
        style={styles.bodyBg}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/create_address");
          }}
        >
          <Text style={styles.buttonText}>+ เพิ่มที่อยู่</Text>
        </TouchableOpacity>

        <View
          style={
            !addressData || addressData.length === 0
              ? { ...styles.addressSection, flex: 1 }
              : { ...styles.addressSection }
          }
        >
          {!addressData || addressData.length === 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Text style={{ ...styles.text, textAlign: "center" }}>
                ไม่พบข้อมูลที่อยู่
              </Text>
            </View>
          ) : (
            addressData.map((data, index) => {
              const address =
                data.address +
                " " +
                data.subdistrict +
                " " +
                data.district +
                " " +
                data.province +
                " " +
                data.zipcode;
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/edit_address/[id]",
                      params: { id: data.address_id },
                    });
                  }}
                  style={styles.addressCard}
                  key={index}
                >
                  <Text style={styles.text}>{address}</Text>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color="#71BFFF"
                  />
                </TouchableOpacity>
              );
            })
          )}
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
  scrollViewContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  bodyBg: {
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: "100%",
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
  addressSection: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  addressCard: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 3,
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Kanit",
    fontWeight: "400",
    flex: 2,
  },
});

export default AddressPage;
