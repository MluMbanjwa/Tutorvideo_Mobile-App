
import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

import MathText from "../view/MathText";

const UserDropdown = ({
  name,
  data = [],
  value,
  setValue,
  placeholder = "Select an option",
  labelField = "label",
  valueField = "value",
  search = false,
  math = false,
  searchPlaceholder = "Search...",
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);

  const selectedItem = useMemo(() => {
    return data.find(
      (item) => item[valueField] === value
    );
  }, [data, value, valueField]);

  const selectedLabel = selectedItem
    ? String(selectedItem[labelField] ?? "")
    : "";

  const hasSelection = selectedItem != null;

  const renderMathItem = (item, selected) => (
    <View
      style={[
        styles.mathItem,
        selected && styles.mathItemSelected,
      ]}
    >
      <View
        style={styles.mathContent}
        pointerEvents="none"
      >
        <MathText fontSize={16}>
          {String(item[labelField] ?? "")}
        </MathText>
      </View>

      {selected && (
        <Ionicons
          name="checkmark"
          size={20}
          color="#2563eb"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {name && (
        <Text style={styles.title}>
          {name.toUpperCase()}:
        </Text>
      )}

      <Dropdown
        style={[
          styles.dropdown,
          math && styles.mathDropdown,
          focused && styles.dropdownFocused,
          disabled && styles.dropdownDisabled,
        ]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={[
          styles.selectedText,
          math && styles.hiddenSelectedText,
        ]}
        inputSearchStyle={styles.searchInput}
        iconStyle={styles.icon}
        data={data}
        search={search}
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        placeholder={
          math && hasSelection
            ? ""
            : focused
              ? "..."
              : placeholder
        }
        searchPlaceholder={searchPlaceholder}
        value={value}
        disable={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(item) => {
          setValue(item[valueField]);
          setFocused(false);
        }}
        renderItem={
          math ? renderMathItem : undefined
        }
        renderLeftIcon={
          math && hasSelection
            ? () => (
                <View
                  style={styles.selectedMath}
                  pointerEvents="none"
                >
                  <MathText fontSize={16}>
                    {selectedLabel}
                  </MathText>
                </View>
              )
            : undefined
        }
        renderRightIcon={() => (
          <Ionicons
            name={
              focused
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={
              focused ? "#2563eb" : "#000000"
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 30,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },

  dropdown: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderTopColor: "#bdbdbd",
    borderLeftColor: "#bdbdbd",
    borderRightColor: "#ffffff",
    borderBottomColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  mathDropdown: {
    minHeight: 65,
  },

  dropdownFocused: {
    borderWidth: 2,
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
  },

  dropdownDisabled: {
    opacity: 0.5,
  },

  placeholder: {
    fontSize: 16,
    color: "#9ca3af",
  },

  selectedText: {
    fontSize: 16,
    color: "#111827",
  },

  hiddenSelectedText: {
    color: "transparent",
    fontSize: 1,
    flex: 0,
    width: 0,
  },

  selectedMath: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 8,
    justifyContent: "center",
  },

  mathItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 55,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  mathItemSelected: {
    backgroundColor: "#eff6ff",
  },

  mathContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  icon: {
    width: 20,
    height: 20,
  },

  searchInput: {
    height: 45,
    fontSize: 16,
    borderRadius: 8,
  },
});

export default UserDropdown;
