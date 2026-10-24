import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Details = ({
  data = {},
  title = "Details",
}) => {
  const detailEntries = Object.entries(data);

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .trim();
  };

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return value.length > 0
        ? value.join(", ")
        : "None";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {title}
          </Text>

          {detailEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No details available.
              </Text>
            </View>
          ) : (
            detailEntries.map(
              ([key, value], index) => (
                <View
                  key={key}
                  style={[
                    styles.row,
                    index ===
                      detailEntries.length - 1 &&
                      styles.lastRow,
                  ]}
                >
                  <Text style={styles.label}>
                    {formatLabel(key)}
                  </Text>

                  <Text style={styles.value}>
                    {formatValue(value)}
                  </Text>
                </View>
              )
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#eef3f8",
  },

  scrollArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },

  container: {
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  label: {
    flex: 1,
    paddingRight: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#4b5563",
    lineHeight: 21,
  },

  value: {
    flex: 1.3,
    fontSize: 15,
    color: "#111827",
    textAlign: "right",
    lineHeight: 21,
  },

  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default Details;
