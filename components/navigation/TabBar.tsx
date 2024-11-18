import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

const Bubble = require("../../assets/images/Bubble.png");
const ScanIcon = require("../../assets/images/scanner.png");
interface TabbarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar = ({ state, descriptors, navigation }: TabbarProps) => {
  const screenHeight = Dimensions.get("window").height;
  const tabIcons = {
    home: <Ionicons name="home" size={28} />,
    history: <FontAwesome5 name="shopping-basket" size={28} />,
    payment: (
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate("payment")}
        >
          <Image source={Bubble} style={styles.bubble} />
          <Image source={ScanIcon} style={styles.scanner} />

          {/* <MaterialCommunityIcons name="line-scan" size={48} color="#3A82F7" /> */}
        </TouchableOpacity>
      </View>
    ),
    message: <Ionicons name="chatbox-ellipses-outline" size={28} />,
    profile: <FontAwesome6 name="circle-user" size={28} />,
  };

  return (
    <View style={screenHeight > 700 ? styles.tabbar : styles.iphoneSE}>
      {state.routes.map(
        (
          route: { key: string | number; name: string; params: any },
          index: React.Key | null | undefined
        ) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <View style={styles.tab} key={index}>
              <TouchableOpacity
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                {route.name === "payment" ? (
                  tabIcons.payment
                ) : (
                  <>
                    <Text
                      style={{
                        color: isFocused ? "#2594E1" : "#696969",
                      }}
                    >
                      {tabIcons[route.name as keyof typeof tabIcons]}
                    </Text>
                    <Text
                      style={{
                        ...styles.tabText,
                        color: isFocused ? "#2594E1" : "#696969",
                      }}
                    >
                      {label}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          );
        }
      )}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    paddingBottom: 25,
    paddingTop: 10,
    paddingHorizontal: 15, // Increase horizontal padding
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    shadowColor: "#BDE2FF",
    elevation: 5,
    ...Platform.select({
      android: {
        elevation: 25,
        shadowColor: "#005ff7",
        shadowRadius: 10,
      },
    }),
  },
  iphoneSE: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    paddingBottom: 5,
    paddingTop: 10,
    paddingHorizontal: 15, // Increase horizontal padding
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    shadowColor: "#BDE2FF",
    elevation: 5,
    ...Platform.select({
      android: {
        elevation: 25,
        shadowColor: "#005ff7",
        shadowRadius: 10,
      },
    }),
  },
  tab: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
    zIndex: 1,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Kanit_300Light",
  },
  paymentContainer: {
    position: "absolute",
    top: -30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginHorizontal: 20, // Add horizontal margin to space from other tabs
  },
  paymentButton: {
    borderRadius: 35,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    elevation: 10,
  },
  bubble: {
    position: "absolute",
    top: -5.5,
    zIndex: 0,
    marginHorizontal: 20,
    width: 80,
    height: 80,
  },
  scanner: {
    position: "absolute",
    top: 15,
    zIndex: 1,
    width: 40,
    height: 40,
  },
});
