import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import{ 
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
import "../global.css";


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
