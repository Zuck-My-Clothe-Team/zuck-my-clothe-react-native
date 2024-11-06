require("dotenv").config();

module.exports = {
  expo: {
    name: "Zuck My Clothe",
    slug: "zuck-my-clothe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "zuckmyclothe",
    jsEngine: "hermes",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0285df",
    },
    ios: {
      bundleIdentifier: "com.sokungz.zuckmyclothe",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
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
      locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
      package: "com.sokungz.zuckmyclothe",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "9c30521d-6156-4df5-a088-d634cdf53408",
      },
    },
  },
};
