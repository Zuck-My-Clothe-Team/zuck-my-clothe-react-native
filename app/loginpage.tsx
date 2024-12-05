import { GoogleLogin } from "@/api/auth.api";
import { useAuth } from "@/context/auth.context";
import { IUserTokenDetail } from "@/interface/userdetail.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";

import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const LoginPageImage = require("../assets/images/loginImage.png");

export default function LoginPage() {
  const screenHeight = Dimensions.get("window").height;
  const isSmallScreen = screenHeight < 700;
  const [disabledLogin, setDisableLogin] = useState<boolean>(false);
  const auth = useAuth();

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  const SignIn = async () => {
    try {
      setDisableLogin(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      await AsyncStorage.setItem("loginMethod", "google");
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;
      if (!accessToken) {
        throw new Error("No idToken found");
      }
      const userInfo: IUserTokenDetail = await GoogleLogin(accessToken);
      const { data, token } = userInfo;
      await AsyncStorage.setItem("accessToken", token);
      auth?.setAuthContext({ ...data, isAuth: true });
      console.log("User info and token stored successfully.");
    } catch (error) {
      await AsyncStorage.removeItem("loginMethod");
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("User cancelled the sign in flow");
            break;
          case statusCodes.IN_PROGRESS:
            console.log("Sign in is in progress already");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available or outdated");
            break;
          default:
            console.log("Something went wrong:", error);
        }
      }
    } finally {
      setDisableLogin(false);
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-primaryblue-300 items-center flex flex-col">
      <View
        className={`flex w-full ${
          isSmallScreen ? "h-[62.5%]" : "h-[67.5%]"
        } bg-primaryblue-300 justify-center items-center px-12 gap-y-14`}
      >
        <View className=" flex justify-center items-center gap-y-4">
          <Image source={LoginPageImage} className="" resizeMode="center" />
        </View>
      </View>
      <View className="bg-white w-full h-full flex flex-col p-7">
        <Text className=" font-kanitMedium  text-4xl py-1 text-text-3">
          ยินดีต้อนรับกลับ
        </Text>
        <Text className=" font-kanitMedium  text-3xl text-text-4 pt-1">
          เข้าสู่ระบบ
        </Text>
        <View className={`flex ${isSmallScreen ? "gap-y-6" : "gap-y-8"} mt-8`}>
          <TouchableOpacity
            className={`py-3 bg-white border border-primaryblue-300 rounded-3xl flex justify-center items-center w-full`}
            onPress={async () => {
              await SignIn();
            }}
            testID="login-button"
            disabled={disabledLogin}
          >
            <View className="flex flex-row">
              <Image
                source={require("../assets/images/google-icon.png")}
                className="size-7 mr-1"
              />
              <Text className="font-noto text-lg">Continue with Google</Text>
            </View>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => router.push("/login_employee")}>
              <Text className="font-kanitLight text-[14px] text-center text-text-4">
                เข้าสู่ระบบด้วยอีเมลล์
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
