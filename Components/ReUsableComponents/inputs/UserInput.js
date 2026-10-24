import { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";

const UserInput = ({
  name,
  value,
  setValue,
  autoCapitalize = "none",
  autoComplete = "off",
  autoCorrect = false,
  inlineImageLeft = "",
  number = 5,
  inputMode = "text",
  secureTextEntry = false,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={style.container} >
      <Text style={style.title}>{name.toUpperCase()}:</Text>
      <TextInput
        style={[
          style.input,
          focused && style.inputFocused,
        ]}
        value={value}
        onChangeText={setValue}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        inlineImageLeft={inlineImageLeft}
        number={number}
        inputMode={inputMode}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100vw",
    marginVertical: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginLeft: 5,
  },

input: {
  width: "100%",
  height: 50,

  backgroundColor: "#f5f5f5",

  borderBottomWidth: 1,
  borderTopColor: "#c8c8c8",
  borderLeftColor: "#c8c8c8",
  borderRightColor: "#ffffff",
  borderBottomColor: "#ffffff",

  borderRadius: 10,

  paddingHorizontal: 15,
  marginBottom: 30,

  fontSize: 16,
  color: "#000",
  shadowOffset: {
    Width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,

  elevation: -10,
},

  inputFocused: {
    borderBottomColor: "#007AFF",
    borderBottomWidth:2,
      borderRadius: 10,
  },
});

export default UserInput;