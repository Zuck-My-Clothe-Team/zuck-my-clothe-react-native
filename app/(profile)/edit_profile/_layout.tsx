import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const EditProfileLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default EditProfileLayout;
