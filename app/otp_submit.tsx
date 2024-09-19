import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Ensure you have react-navigation installed
import Ionicons from "@expo/vector-icons/Ionicons";
const Logo = require("../assets/images/icon.png");

const OTPSubmit = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // State to hold each digit
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRefs = useRef<any>([]); // Array of references to TextInput
  const navigation = useNavigation(); // Navigation hook to handle back action

  const handleOTPChange = (text: string, index: number) => {
    // Ensure the text only contains numeric characters
    setErrorMessage("");
    const cleanedText = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    if (cleanedText.length === 1) {
      // Update the current OTP digit
      newOtp[index] = cleanedText;
      setOtp(newOtp);

      // Move to the next input box if available
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      } else {
        Keyboard.dismiss(); // Dismiss keyboard when the last box is filled
      }
    } else if (cleanedText === "") {
      // Handle backspace
      newOtp[index] = ""; // Clear the current input
      setOtp(newOtp);

      // Move focus to the previous input if backspacing
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      // If backspace is pressed and the current box is empty
      if (index > 0 && otp[index] === "") {
        // Clear the previous box
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);

        // Move focus to the previous box
        inputRefs.current[index - 1].focus();
      }
      setErrorMessage("");
    }
  };

  const handleOTPSubmit = () => {
    const otpString = otp.join(""); // Join the array to form the OTP string
    const correctOTP = "123456"; // For demo purposes

    if (otpString === correctOTP) {
      Alert.alert("Success", "OTP verified successfully");
      // Proceed to the next step in your app
    } else {
      setErrorMessage("Incorrect OTP. Please try again.");
    }

    Keyboard.dismiss();
  };

  const handleResendOTP = () => {
    // Simulate OTP resend action
    setOtp(["", "", "", "", "", ""]); // Clear OTP input
    setErrorMessage("");
    Alert.alert("OTP Resent", "A new OTP has been sent to your phone.");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView className="min-h-screen bg-slate-200" keyboardDismissMode="interactive" bounces={false}>
      <SafeAreaView className="min-h-screen bg-slate-200 justify-center items-center">
        <View className="flex-1 w-full px-6 py-8">
          {/* Back Button */}
          <TouchableOpacity
            className="absolute z-50 py-2 px-4"
            onPress={() => navigation.goBack()} // Go back to the previous screen
          >
            <Ionicons name="chevron-back" size={30} color="#1e40af" />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center">
            <Image
              source={Logo}
              className="size-32 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-blue-600 mb-2">
              Enter OTP
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-8">
              Please enter the 6-digit OTP sent to your phone.
            </Text>

            {/* OTP Input Fields */}
            <View className="flex flex-row justify-between w-full max-w-xs mb-3">
              {otp.map((digit, index) => (
                <TextInput
                  testID={`otp-input-box`} // Set testID for testing
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)} // Set reference to each TextInput
                  className="w-12 h-12 bg-white text-center text-3xl font-semibold text-blue-600 border border-slate-400 rounded-lg"
                  value={digit}
                  onChangeText={(text) => handleOTPChange(text, index)} // Handle input for each box
                  onKeyPress={(e) => handleKeyPress(e, index)} // Handle backspace key
                  keyboardType="number-pad"
                  maxLength={1}
                  autoFocus={index === 0} // Autofocus on the first box
                  autoComplete="one-time-code"
                />
              ))}
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <Text className="text-red-500 text-center mt-2">
                {errorMessage}
              </Text>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              className="w-full h-14 bg-blue-800 rounded-full flex justify-center items-center mt-6 mb-4"
              onPress={handleOTPSubmit}
              testID="submit-button" // Set testID for testing
            >
              <Text className="text-white text-xl font-bold">Submit</Text>
            </TouchableOpacity>

            {/* Resend OTP Button */}
            <TouchableOpacity onPress={handleResendOTP} testID="resend-button">
              <Text className="text-blue-600 underline mt-4">Resend OTP</Text>
            </TouchableOpacity>
          </View>
          <View className=" h-16"></View>
        </View>
      </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPSubmit;
