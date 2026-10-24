import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";

const AnimatedImage = Animated.createAnimatedComponent(Animated.Image);

const ProfilePicture = ({
  title = "",
  url,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const zoomIn = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const zoomOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const imageSource =
    typeof url === "string" && url.trim() !== ""
      ? { uri: url }
      : require("../../../assets/default-profile.png");

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={zoomIn}
        onPressOut={zoomOut}
        accessibilityRole="imagebutton"
        accessibilityLabel={`${title || "User"} profile picture`}
      >
        <AnimatedImage
          source={imageSource}
          resizeMode="cover"
          style={[
            styles.circularImg,
            {
              transform: [{ scale }],
            },
          ]}
        />
      </Pressable>

      {title.trim() !== "" && (
        <Text style={styles.title}>
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  circularImg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#2563EB",
    backgroundColor: "#E5E7EB",
  },

  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
});

export default ProfilePicture;