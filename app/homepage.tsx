import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, SplashScreen } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

const Homepage = () => {
  SplashScreen.preventAutoHideAsync();

  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setAccessToken("");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken !== null && accessToken !== "") {
          setAccessToken(accessToken);
        } else {
          router.push("/loginpage");
        }
      } catch (error) {
        console.log("Error fetching access token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, [accessToken]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 h-full justify-around px-8 w-full">
      <View className=" w-full px-4 flex flex-col gap-y-4">
        <Text className="text-2xl font-bold text-center">This is homepage</Text>
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-full w-full"
          onPress={logout}
        >
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Homepage;
