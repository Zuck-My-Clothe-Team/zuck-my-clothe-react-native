import { SignIn } from "@/api/auth.api";
import { useAuth } from "@/context/auth.context";
import { IAuth } from "@/interface/auth.interface";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LoginPageImage = require("../assets/images/loginImage.png");

export default function LoginEmployeePage() {
  const auth = useAuth();
  const [disabledLogin, setDisableLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setDisableLogin(true);
    const data: IAuth = {
      email: email,
      password: password,
    };
    try {
      const result = await SignIn(data);
      if (!result || result.status !== 200) throw new Error("Invalid login");
      const accessToken = result.data.token;
      await AsyncStorage.setItem("accessToken", accessToken);
      auth?.setAuthContext({ ...auth.authContext, isAuth: true });
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setDisableLogin(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && validateEmail(email);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeAreaView className="w-full h-full bg-white items-center flex flex-col">
            <View className="flex w-full h-[40%] bg-primaryblue-300 justify-center items-center px-12 gap-y-14">
              <View className=" flex justify-center items-center gap-y-4">
                <Image
                  source={LoginPageImage}
                  className=""
                  resizeMode="center"
                />
              </View>
            </View>
            <View className="bg-white w-full h-full flex flex-col px-7 py-7">
              <Text className=" font-kanitMedium text-4xl py-2 text-text-3">
                ยินดีต้อนรับกลับ
              </Text>
              <Text className=" font-kanitMedium text-3xl font-medium text-text-4 pt-1 pb-8">
                เข้าสู่ระบบ
              </Text>
              <View className="flex gap-y-5">
                <TextInput
                  className="rounded-[4px] border border-secondaryblue-100 p-2 placeholder:text-customgray-200"
                  placeholder="อีเมลล์"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ height: 40, fontFamily: "Kanit" }}
                />
                <View className=" relative">
                  <TextInput
                    className="rounded-[4px] border border-secondaryblue-100 p-2 placeholder:text-customgray-200"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    keyboardType="default"
                    style={{ height: 40, fontFamily: "Kanit" }}
                  />
                  <TouchableOpacity
                    className="absolute right-2 top-2"
                    onPress={toggleShowPassword}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#aaa"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mt-14">
                <TouchableOpacity
                  onPress={async () => {
                    await handleLogin();
                  }}
                  disabled={disabledLogin || !isFormValid}
                  className="bg-primaryblue-300 disabled:bg-primaryblue-100 py-3 rounded-md justify-center items-center"
                >
                  <Text className="text-white font-kanit text-lg font-medium">
                    เข้าสู่ระบบ
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mt-6">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="font-kanitLight text-[14px] text-center text-text-4">
                    เข้าสู่ระบบด้วย Social media
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
