import { Tabs } from "expo-router";
import React from "react";
import TabBar from "../../components/navigation/TabBar";

const TabsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{ headerShown: false, title: "ออเดอร์" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false, title: "หน้าหลัก" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
