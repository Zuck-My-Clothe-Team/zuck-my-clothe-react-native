import { Tabs } from "expo-router";
import React from "react";
import TabBar from "../../components/navigation/TabBar";
const TabsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
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
        options={{ headerShown: false, title: "" }}
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
