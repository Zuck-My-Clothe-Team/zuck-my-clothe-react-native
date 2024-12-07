import { Stack } from "expo-router";
import React from "react";
const TermOfServicesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TermOfServicesLayout;
