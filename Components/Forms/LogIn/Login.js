import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import TutorVideoIcon from "../../ReUsableComponents/view/TutorVideoIcon";
import { z } from "zod";
import MyIcon from "../../ReUsableComponents/view/Icon"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UserInput from "../../ReUsableComponents/inputs/UserInput";

import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton";

import { forgotPassword, loginUser } from "../../../DataFetching/Users";

import { notifyAuthChange } from "../../../AuthEvents";

// ==========================================
// VALIDATION SCHEMA
// ==========================================

const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, "Please enter your email or phone number")
    .max(100, "Email or phone number is too long"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password is too long"),
});

// ==========================================
// LOGIN COMPONENT
// ==========================================

const Login = ({ navigation }) => {
  const [submitting, setSubmitting] = useState(false);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // ==========================================
  // CLEAR FIELD ERROR
  // ==========================================

  const clearFieldError = (fieldName) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));

    setServerError("");
  };
//handle forgot password:
const handleForgotPassword=async()=>{
  if(!login){
    alert("enter email first");
    return;
  }
  const forget=await forgotPassword(login);
  alert(`${forget.message}, please go to your email ${login}`);
}
  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleLogin = async () => {
    if (submitting) return;

    setErrors({});
    setServerError("");

    const result = loginSchema.safeParse({
      login,
      password,
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      // Authenticate the user
      await loginUser({
        login: result.data.login,
        password: result.data.password,
      });

      // Check if user information was saved
      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Login succeeded, but user information was not saved."
        );
      }

      // Verify that saved user data is valid
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser || typeof parsedUser !== "object") {
        throw new Error("Invalid user information.");
      }

      // Notify NavBar and App.js about login
      notifyAuthChange();

      Alert.alert(
        "Login successful",
        "You are now logged in."
      );

      // Navigate to Topics
      // Only if Topics is registered in this navigator
      if (
        navigation.getState()?.routeNames?.includes("Topics")
      ) {
        navigation.navigate("Topics");
      }

    } catch (error) {
      console.error("Could not log in:", error);

      setServerError(
        error.message ||
          "Could not log in. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

return (
  <KeyboardAwareScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraHeight={75}
    extraScrollHeight={30}
    keyboardOpeningTime={0}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    enableResetScrollToCoords={false}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.card}>
      <Text style={styles.title}>
        Welcome Back
      </Text>
      <Text style={styles.subtitle}>
        <TutorVideoIcon size={100}/>
      </Text>
      <Text style={styles.subtitle}>
        Sign in to continue.
      </Text>
      <UserInput
        name="Email or Phone Number"
        value={login}
        setValue={(value) => {
          setLogin(value);
          clearFieldError("login");
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {errors.login?.[0] && (
        <Text style={styles.errorText}>
          {errors.login[0]}
        </Text>
      )}

      <UserInput
        name="Password"
        value={password}
        setValue={(value) => {
          setPassword(value);
          clearFieldError("password");
        }}
        secureTextEntry
      />

      {errors.password?.[0] && (
        <Text style={styles.errorText}>
          {errors.password[0]}
        </Text>
      )}

      {serverError ? (
        <View style={styles.serverErrorContainer}>
          <Text style={styles.serverErrorText}>
            {serverError}
          </Text>
        </View>
      ) : null}
      <View
      style={styles.inline}
      >
        <MyIcon name="key"/> 
        <Text  style={styles.navigate} onPress={handleForgotPassword}>Forgot password</Text>
      </View>
      <SubmitButton
        title="Login"
        submittingText="Logging in..."
        onPress={handleLogin}
        submitting={submitting}
      />

      <Text style={styles.subtitle}>
        Don't have an account?{" "}
        <Text
          style={styles.navigate}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  </KeyboardAwareScrollView>
);
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },

  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom:150,
    marginTop:10,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 25,
  },

  errorText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "500",
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },

  serverErrorContainer: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },

  serverErrorText: {
    color: "#b91c1c",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  navigate: {
    color: "#3eb91c",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default Login;