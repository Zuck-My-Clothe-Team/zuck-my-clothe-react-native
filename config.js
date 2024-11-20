require("dotenv").config();

module.exports = {
  expo: {
    name: "Zuck My Clothes",
    slug: "zuck-my-clothes",
    owner: "zuck-my-clothes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "zuckmyclothe",
    jsEngine: "hermes",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0285df",
    },
    ios: {
      bundleIdentifier: "com.sokungz.zuckmyclothes",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      locationAlwaysAndWhenInUsePermission:
        "Allow $(PRODUCT_NAME) to use your location.",
      cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#0285df",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      locationAlwaysAndWhenInUsePermission:
        "Allow $(PRODUCT_NAME) to use your location.",
      cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
      package: "com.sokungz.zuckmyclothes",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: `${process.env.EXPO_PUBLIC_IOS_URL_SCHEME}`,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "523cea7a-5a6a-4207-aacb-71ad3031b17d",
      },
    },
  },
};
