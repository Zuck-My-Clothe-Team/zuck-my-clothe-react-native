import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Homepage from "./homepage";
import LoginPage from "./loginpage";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken !== null) {
          setAccessToken(accessToken);
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
    <Stack.Navigator>
      {accessToken ? (
        <Stack.Screen
          name="Home"
          component={Homepage}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default App;
