/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        notoThin: ["NotoSans_100Thin", "sans-serif"],
        notoExtraLight: ["NotoSans_200ExtraLight", "sans-serif"],
        notoLight: ["NotoSans_300Light", "sans-serif"],
        noto: ["NotoSans_400Regular", "sans-serif"],
        notoMedium: ["NotoSans_500Medium", "sans-serif"],
        notoSemiBold: ["NotoSans_600SemiBold", "sans-serif"],
        notoBold: ["NotoSans_700Bold", "sans-serif"],
        notoExtraBold: ["NotoSans_800ExtraBold", "sans-serif"],
        notoBlack: ["NotoSans_900Black", "sans-serif"],

        // Kanit weights
        kanitThin: ["Kanit_100Thin", "sans-serif"],
        kanitExtraLight: ["Kanit_200ExtraLight", "sans-serif"],
        kanitLight: ["Kanit_300Light", "sans-serif"],
        kanit: ["Kanit_400Regular", "sans-serif"],
        kanitMedium: ["Kanit_500Medium", "sans-serif"],
        kanitSemiBold: ["Kanit_600SemiBold", "sans-serif"],
        kanitBold: ["Kanit_700Bold", "sans-serif"],
        kanitExtraBold: ["Kanit_800ExtraBold", "sans-serif"],
        kanitBlack: ["Kanit_900Black", "sans-serif"],
      },
      colors: {
        primaryblue: {
          100: "#50A5DF",
          200: "#2594E1",
          300: "#0285DF",
        },
        secondaryblue: {
          100: "#BDE2FF",
          200: "#9AD2FF",
          300: "#71BFFF",
        },
        text: {
          1: "#373737",
          2: "#F9FAFF",
          3: "#0080D7",
          4: "#696969",
        },
        background: {
          1: "#F9FAFF",
          2: "#236D9F",
          3: "#FFFFFF",
        },
        yellowaccent: {
          100: "#FFEFBD",
          200: "#FFEAA4",
          300: "#FFE286",
          400: "#FDDA69",
        },
        customgray: {
          100: "#F1F1F1",
          200: "#E3E3E3",
          300: "#D8D8D8",
          400: "#C6C6C6",
        },
        customred: {
          1: "#F0507E",
          2: "#FFA094",
        },
      },
      boxShadow: {
        "yellow-small": "0px 2px 4px rgba(255,239,189,0.25)",
        "yellow-normal": "0px 4px 8px rgba(255,239,189,0.35)",
        "blue-small": "0px 8px 4px rgba(189,226,255,0.25)",
        "blue-normal": "0px 8px 4px rgba(189,226,255,0.35)",
        "blue-hard": "0px 2px 14.8px rgba(5,90,156,0.25)",
      },
      borderRadius: {
        small: "4px",
        normal: "8px",
        medium: "16px",
        large: "24px",
      },
    },
  },
  plugins: [],
};
