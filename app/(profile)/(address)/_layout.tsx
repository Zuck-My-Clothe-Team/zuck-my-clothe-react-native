import { LocationProvider } from "@/context/location.context";
import { Stack } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen name="address" options={{ headerShown: false }} />
        <Stack.Screen name="create_address" options={{ headerShown: false }} />
        <Stack.Screen
          name="edit_address/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="edit_address/map"
          options={{ headerShown: false }}
        />
      </Stack>
    </LocationProvider>
  );
};

export default TabsLayout;
