import { GoogleLogin } from "@/api/auth.api";
import { useAuth } from "@/context/auth.context";
import { IUserTokenDetail } from "@/interface/userdetail.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { router, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
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

  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: AuthSession.makeRedirectUri({
      native: "com.sokungz.zuckmyclothe:/oauth2redirect",
    }),
  });

  useEffect(() => {
    const handleSignInWithGoogle = async () => {
      if (response?.type === "success") {
        try {
          const { authentication } = response;
          console.log("Google sign-in response:");
          const userInfo: IUserTokenDetail = await GoogleLogin(
            authentication!.accessToken
          );
          const accessToken = userInfo.token;
          await AsyncStorage.setItem("accessToken", accessToken);
          auth?.setAuthContext({
            isAuth: true,
            user_id: userInfo.data.user_id,
            email: userInfo.data.email,
            firstname: userInfo.data.firstname,
            role: userInfo.data.role,
            lastname: userInfo.data.lastname,
            phone: userInfo.data.phone,
            profile_image_url: userInfo.data.profile_image_url,
          });
          console.log("User info and token stored successfully.");
        } catch (error) {
          console.log("Error during Google sign-in:", error);
        }
      } else {
        console.log(
          "Google sign-in response error or not successful:",
          response
        );
      }
      setDisableLogin(false);
    };

    handleSignInWithGoogle();
  }, [response]);

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
            onPress={() => {
              promptAsync();
              setDisableLogin(true);
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
