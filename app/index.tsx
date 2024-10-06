import { GoogleLogin } from "@/api/auth.api";
import { IUserDetail } from "@/interface/userdetail.interface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IGoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

const Logo = require("../assets/images/icon.png");

const App = () => {
  const [form, setform] = useState<{
    phone_number: string;
  }>({
    phone_number: "",
  });

  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");

  const formatPhoneNumberForDisplay = (text: string) => {
    // Format the phone number based on length
    if (text.length <= 5) {
      // Format as xxx xx when 5 or fewer digits
      return text.replace(/(\d{3})(\d{0,2})/, (match, p1, p2) => {
        if (p2) return `${p1} ${p2}`;
        return p1;
      });
    } else {
      // Format as xxx xxx xxxx for longer numbers
      return text.replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) => {
        if (p3) return `${p1} ${p2} ${p3}`;
        else if (p2) return `${p1} ${p2}`;
        return p1;
      });
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters
    let cleanText = text.replace(/\D+/g, "");

    // Condition for first digit being 0
    if (cleanText.length > 0 && cleanText[0] !== "0") {
      cleanText = "";
    }

    // Condition for second digit being 6, 8, or 9
    if (cleanText.length > 1 && !/[689]/.test(cleanText[1])) {
      cleanText = cleanText.slice(0, 1); // Remove the second digit if it's not 6, 8, or 9
    }

    // Update state with the valid phone number, max 10 digits
    if (cleanText.length <= 10) {
      setform({ phone_number: cleanText });
      setEnableSubmit(false);
    }

    // Dismiss keyboard when 10 digits are entered
    if (cleanText.length === 10) {
      Keyboard.dismiss();
      setEnableSubmit(true);
    }
  };

  const [userInfo, setUserInfo] = useState<IGoogleUser>({
    id: "",
    email: "",
    verified_email: false,
    name: "",
    given_name: "",
    family_name: "",
    picture: "",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken !== null) {
        setAccessToken(accessToken);
      }
    };

    fetchData();
  }, [accessToken]);

  const logout = async () => {
    setAccessToken("");
    await AsyncStorage.removeItem("accessToken");
  };

  const handleSignInWithGoogle = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const userInfo: IUserDetail = await GoogleLogin(
        authentication!.accessToken
      );
      const accessToken = userInfo.token;
      await AsyncStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1">
      <ScrollView
        className=" flex-1"
        keyboardDismissMode="interactive"
        bounces={false}
      >
        <SafeAreaView className="w-full min-h-screen bg-slate-200 justify-center items-center">
          <View className="flex w-full justify-center items-center px-12 gap-y-14">
            <View className=" flex justify-center items-center gap-y-4">
              <Image source={Logo} className="size-32" resizeMode="contain" />
              <Text className="font-bold text-4xl text-blue-600">
                Suck My Clothe
              </Text>
            </View>
            <View className="flex w-full justify-center items-center gap-y-4">
              <Text className="text-2xl font-bold text-slate-800 text-center">
                Enter your phone number
              </Text>
              <View className="flex flex-row w-full pr-16 bg-white rounded-xl">
                <View className="flex items-center justify-center border-r-2 border-slate-300">
                  <FontAwesome6
                    name="phone"
                    size={24}
                    color="#2563eb"
                    className="py-4 px-5"
                  />
                </View>
                <TextInput
                  className="flex w-full h-16 pr-2 text-3xl font-semibold text-blue-600"
                  textAlign="center"
                  inputMode="numeric"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={formatPhoneNumberForDisplay(form.phone_number)} // Render formatted phone number
                  onChangeText={handlePhoneNumberChange} // Handle phone number changes
                  maxLength={12} // Allow for formatting spaces, but input is capped at 10 digits
                  placeholder="0xx xxx xxxx"
                />
              </View>
            </View>
            <View className="flex justify-center items-center">
              <Text className="text-slate-600 text-center">
                We will send you a one time SMS message. Carrier charges may
                apply.
              </Text>
              <Text>{userInfo.name}</Text>
              <Text>Storage : {accessToken}</Text>
            </View>
            {accessToken === "" ? (
              <>
                <TouchableOpacity
                  className={`w-full h-14 ${
                    enableSubmit ? "bg-blue-800" : "bg-slate-400"
                  } rounded-full flex justify-center items-center`}
                  onPress={() => {
                    promptAsync();
                  }}
                  testID="login-button"
                >
                  <Text className="font-bold text-white text-xl">Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className={`w-full h-14 ${
                    enableSubmit ? "bg-blue-800" : "bg-slate-400"
                  } rounded-full flex justify-center items-center`}
                  onPress={logout}
                >
                  <Text className="font-bold text-white text-xl">Logout</Text>
                </TouchableOpacity>
              </>
            )}
            <View className=" h-8"></View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default App;
