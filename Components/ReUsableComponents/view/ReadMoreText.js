import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

const ReadMoreText = ({
  text = "",
  numberOfLines = 3,
  textStyle,
  buttonStyle,
  buttonTextStyle,
  readMoreText = "Read more",
  readLessText = "Read less",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={[styles.description, textStyle]}
        numberOfLines={expanded ? undefined : numberOfLines}
        onTextLayout={(event) => {
          if (!expanded) {
            setShowButton(
              event.nativeEvent.lines.length > numberOfLines
            );
          }
        }}
      >
        {text}
      </Text>

      {showButton && (
        <Pressable
          onPress={() => setExpanded((current) => !current)}
          style={({ pressed }) => [
            styles.button,
            buttonStyle,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              buttonTextStyle,
            ]}
          >
            {expanded ? readLessText : readMoreText}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },

  button: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingVertical: 4,
  },

  buttonPressed: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default ReadMoreText;