import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";

const Logo = require("../assets/images/icon.png");

const App = () => {
  const [form, setform] = useState({
    phone_number: "",
  });

  const [enableSubmit, setEnableSubmit] = useState(false);

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

  console.log(form.phone_number);

  return (
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
            />
          </View>
        </View>
        <View className="flex justify-center items-center">
          <Text className="text-slate-600 text-center">
            We will send you a one time SMS message. Carrier charges may apply.
          </Text>
        </View>
        <TouchableOpacity
          disabled={form.phone_number.length !== 10}
          className={`w-full h-14 ${enableSubmit ? 'bg-blue-800' : 'bg-slate-400'} rounded-full flex justify-center items-center`}
          onPress={() => {
            router.push("/otp_submit");
          }}
        >
          <Text className="font-bold text-white text-xl">Continue</Text>
        </TouchableOpacity>
        <View className=" h-8"></View>
      </View>
    </SafeAreaView>
  );
};

export default App;
