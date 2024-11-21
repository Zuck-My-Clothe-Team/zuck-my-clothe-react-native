import React from "react";
import { Stack } from "expo-router";

const ReportLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="scanner" options={{ headerShown: false }} />
      <Stack.Screen
        name="[machine_serial]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default ReportLayout;
