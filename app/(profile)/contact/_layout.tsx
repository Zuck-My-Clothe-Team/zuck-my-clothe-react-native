import { Stack } from "expo-router";
import React from "react";

const ContactLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ContactLayout;
