import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { NotoSans_100Thin, NotoSans_400Regular, NotoSans_500Medium } from "@expo-google-fonts/noto-sans";
import { Kanit_100Thin, Kanit_400Regular, Kanit_500Medium } from "@expo-google-fonts/kanit";
import "../global.css";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    NotoSans_100Thin,
    NotoSans_400Regular,
    NotoSans_500Medium,
    Kanit_100Thin,
    Kanit_400Regular,
    Kanit_500Medium,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen 
        name="otp_submit"
        options={{ title: "otp_submit", headerShown: false }}
      />

    </Stack>
  );
}
