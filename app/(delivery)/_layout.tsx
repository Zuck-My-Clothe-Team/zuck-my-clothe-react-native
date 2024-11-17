import React from "react";
import { Stack } from "expo-router";

const DeliveryLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="delivery" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirmation/[order_id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="confirmation/paymentcomplete"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default DeliveryLayout;
