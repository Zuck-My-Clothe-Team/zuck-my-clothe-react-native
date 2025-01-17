import ProtectedLogin from "@/components/auth/ProtectedLogin";
import { AuthProvider } from "@/context/auth.context";
import {
  Kanit_100Thin,
  Kanit_200ExtraLight,
  Kanit_300Light,
  Kanit_400Regular,
  Kanit_500Medium,
  Kanit_600SemiBold,
  Kanit_700Bold,
  Kanit_800ExtraBold,
  Kanit_900Black,
} from "@expo-google-fonts/kanit";
import {
  NotoSans_100Thin,
  NotoSans_200ExtraLight,
  NotoSans_300Light,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  NotoSans_800ExtraBold,
  NotoSans_900Black,
} from "@expo-google-fonts/noto-sans";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import "../global.css";
import "../utils/reanimatedConfig";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    NotoSans_100Thin,
    NotoSans_200ExtraLight,
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_800ExtraBold,
    NotoSans_900Black,
    Kanit_100Thin,
    Kanit_200ExtraLight,
    Kanit_300Light,
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_600SemiBold,
    Kanit_700Bold,
    Kanit_800ExtraBold,
    Kanit_900Black,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }
  return (
    <AuthProvider>
      <ProtectedLogin>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="loginpage" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="(employee)" options={{ headerShown: false }} />
          <Stack.Screen name="(order)" options={{ headerShown: false }} />
          <Stack.Screen
            name="login_employee"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="searchbranch" options={{ headerShown: false }} />
          <Stack.Screen name="order_summary" options={{ headerShown: false }} />
          <Stack.Screen name="(delivery)" options={{ headerShown: false }} />
          <Stack.Screen name="(report)" options={{ headerShown: false }} />
        </Stack>
      </ProtectedLogin>
    </AuthProvider>
  );
}
