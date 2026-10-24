
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export const colors = {
  blue: "#1565c0",
  green: "#28a745",
  text: "#222",
  muted: "#666",
  line: "#e5e5e5",
  bg: "#f6f8fb",
};

export function ProgressBar({ value = 0 }) {
  const pct = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${pct}%` },
        ]}
      />
    </View>
  );
}

export function Message({ children }) {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>
        {children}
      </Text>
    </View>
  );
}

export function Stat({ value, label, tone }) {
  return (
    <View
      style={[
        styles.stat,
        tone === "green" && styles.green,
        tone === "red" && styles.red,
        tone === "yellow" && styles.yellow,
      ]}
    >
      <Text style={styles.number}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 9,
    backgroundColor: "#e9ecef",
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 20,
  },
  message: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    margin: 16,
  },
  messageText: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 15,
  },
  stat: {
    width: "48%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginBottom: 12,
  },
  number: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 4,
  },
  green: {
    backgroundColor: "#e8f7ee",
  },
  red: {
    backgroundColor: "#fdeaea",
  },
  yellow: {
    backgroundColor: "#fff7df",
  },
});
