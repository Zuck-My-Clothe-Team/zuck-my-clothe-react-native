import React, { useState } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const Homepage = () => {
  const [mapRegion, setmapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <View>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      />
    </View>
  );
};

export default Homepage;
