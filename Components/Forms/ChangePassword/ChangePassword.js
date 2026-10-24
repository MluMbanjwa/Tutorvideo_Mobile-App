
import { useState } from "react";

import { updatePassword } from "../../../DataFetching/Users";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import UserInput from "../../ReUsableComponents/inputs/UserInput";
import TutorVideoIcon from "../../ReUsableComponents/view/TutorVideoIcon";
import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton";

const ChangePassword = ({ navigation, route }) => {
  const { user, token } = route?.params ?? {};

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // ==========================================
  // VALIDATE PASSWORDS
  // ==========================================

  const validatePasswords = () => {
    if (!currentPassword.trim()) {
      return "Please enter your current password.";
    }

    if (!newPassword.trim()) {
      return "Please enter your new password.";
    }

    if (newPassword.length < 8) {
      return "New password must contain at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      return "Please confirm your new password.";
    }

    if (newPassword !== confirmPassword) {
      return "New passwords do not match.";
    }

    if (currentPassword === newPassword) {
      return "Your new password must be different from your current password.";
    }

    return null;
  };

  // ==========================================
  // HANDLE PASSWORD UPDATE
  // ==========================================

  const handleSubmit = async () => {
    if (submitting) return;

    setServerError(null);

    // CHECK AUTHENTICATION

    if (!user?._id || !token) {
      Alert.alert(
        "Authentication Required",
        "You must be signed in to change your password.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }

    // VALIDATE PASSWORDS

    const validationError = validatePasswords();

    if (validationError) {
      setServerError(validationError);
      return;
    }

    setSubmitting(true);

    try {

      const response = await updatePassword({
  passwords: {
    currentPassword,
    newPassword,
    confirmPassword,
  },
  userId: user._id,
  token: token,
});

      // Assumes updatePassword throws on HTTP errors.
      // Adjust this if your helper returns an error object.

      if (response?.success === false) {
        throw new Error(
          response.message || "Password update failed."
        );
      }

      // CLEAR PASSWORD FIELDS

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // SUCCESS MESSAGE

      Alert.alert(
        "Password Updated",
        "Your password has been changed successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error(
        "Password update failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update your password. Please try again.";

      setServerError(message);

    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // RENDER
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
      <View style={styles.formCard}>

        {/* LOGO */}

        <View style={styles.logoContainer}>
          <TutorVideoIcon size={100} />

          <Text style={styles.subtitle}>
            Change your current password here!
          </Text>
        </View>

        {/* CURRENT PASSWORD */}

        <UserInput
          name="Current password"
          value={currentPassword}
          setValue={setCurrentPassword}
          secureTextEntry={true}
        />

        {/* NEW PASSWORD */}

        <UserInput
          name="New password"
          value={newPassword}
          setValue={setNewPassword}
          secureTextEntry={true}
        />

        {/* CONFIRM PASSWORD */}

        <UserInput
          name="Confirm password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          secureTextEntry={true}
        />

        {/* SERVER ERROR */}

        {serverError ? (
          <View style={styles.serverErrorContainer}>
            <Text style={styles.serverErrorText}>
              {serverError}
            </Text>
          </View>
        ) : null}

        {/* UPDATE BUTTON */}

        <SubmitButton
          title="Update Password"
          submittingText="Updating Password..."
          onPress={handleSubmit}
          submitting={submitting}
          disabled={submitting}
        />

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

  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  formCard: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,

    marginBottom: 120,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 22,
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
    textAlign: "center",
    fontWeight: "500",
  },
});

export default ChangePassword;
