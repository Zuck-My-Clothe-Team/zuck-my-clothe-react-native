import LoadingBubble from "@/components/auth/Loading";
import { SplashScreen } from "expo-router";
import React from "react";

SplashScreen.preventAutoHideAsync();

// Suppress all logs
// LogBox.ignoreAllLogs(true);

const App = () => {
  return <LoadingBubble />;
};

export default App;
