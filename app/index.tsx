import LoadingBubble from "@/components/auth/Loading";
import { SplashScreen } from "expo-router";
import React from "react";
import { LogBox } from "react-native";

SplashScreen.preventAutoHideAsync();

// Suppress all logs
// LogBox.ignoreAllLogs(true);

const App = () => {
  return <LoadingBubble />;
};

export default App;
