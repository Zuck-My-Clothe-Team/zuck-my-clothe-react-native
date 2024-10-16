import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{ headerShown: false, title: "หน้าหลัก" }}
        />
        <Tabs.Screen
          name="activity"
          options={{ headerShown: false, title: "กิจกรรม" }}
        />
        <Tabs.Screen
          name="payment"
          options={{ headerShown: false, title: "ชำระเงิน" }}
        />
        <Tabs.Screen
          name="message"
          options={{ headerShown: false, title: "ข้อความ" }}
        />
        <Tabs.Screen
          name="profile"
          options={{ headerShown: false, title: "โปรไฟล์" }}
        />
      </Tabs>
  );
};

export default TabsLayout;
