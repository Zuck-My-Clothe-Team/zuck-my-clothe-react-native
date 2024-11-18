import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const StarRating = ({ 
  initialRating = 0, 
  onRatingChange 
}: { 
  initialRating?: number; 
  onRatingChange?: (rating: number) => void; 
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
          <Ionicons
            name="star"
            size={36}
            color={star <= rating ? "#FFE286" : "#E3E3E3"} // Gold for selected, gray for unselected
            style={{ marginHorizontal: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;
