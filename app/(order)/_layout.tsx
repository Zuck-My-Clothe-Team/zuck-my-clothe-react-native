import { Stack } from "expo-router";
import React from "react";
const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="order_detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabsLayout;
