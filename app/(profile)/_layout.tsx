import { Stack } from "expo-router";
import React from "react";
const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(address)" options={{ headerShown: false }} />
      <Stack.Screen name="contact" options={{ headerShown: false }} />
      <Stack.Screen name="edit_profile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabsLayout;
