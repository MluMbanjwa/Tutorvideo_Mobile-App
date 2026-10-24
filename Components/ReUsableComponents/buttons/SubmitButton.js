import { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const SubmitButton = ({
  onPress,
  title = "Button",
  color = "#2563EB",
  textColor = "#fff",
  disabled = false,
  submittingText = "Submitting...",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (disabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onPress?.();
    } catch (error) {
      console.error("Submit button error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Pressable
      onPress={handleSubmit}
      disabled={disabled || isSubmitting}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        (disabled || isSubmitting) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {isSubmitting ? submittingText : title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25, 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginVertical: 10,
    elevation: 4, 
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },
});

export default SubmitButton;