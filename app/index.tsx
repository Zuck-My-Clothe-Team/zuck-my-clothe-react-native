import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, SplashScreen } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken !== null) {
          setAccessToken(accessToken);
          router.replace("/(tabs)/home")
        }
        else if (accessToken === "" || accessToken === null){
          router.replace("/loginpage")
        }
      } catch (e) {
        console.log(e);
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
    <></>
  );
};

export default App;
