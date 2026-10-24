
import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { z } from "zod";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UserDropdown from "../../ReUsableComponents/inputs/UserComboBox";

import {
  grades,
  provinces,
  appUses,
} from "../subComponents/Variables";

import schoolsByProvince from "../subComponents/SchoolsByProvince/schoolsByProvince";

import ImageUpload from "../../ReUsableComponents/inputs/ImageUploader";
import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton";

import TutorVideoIcon from "../../ReUsableComponents/view/TutorVideoIcon";

import { updateUser } from "../../../DataFetching/Users";

// ==========================================
// VALIDATION SCHEMA
// ONLY FIVE FIELDS
// ==========================================

const updateUserSchema = z.object({
  department: z
    .string()
    .trim()
    .min(1, "Please select how you use the app"),

  grade: z.coerce
    .number()
    .int("Please select a valid grade")
    .min(1, "Please select a grade"),

  location: z
    .string()
    .trim()
    .min(1, "Please select a province"),

  institution: z
    .string()
    .trim()
    .min(1, "Please select your school"),

  picture: z.union([
    z.literal(""),
    z.string().url("Picture must be a valid URL"),
  ]),
});

// ==========================================
// UPDATE USER COMPONENT
// ==========================================

const UpdateUser = ({ navigation, route }) => {
  const profileUser = route?.params?.user;

  // ==========================================
  // STATES
  // ==========================================

  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [picture, setPicture] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const submittingRef = useRef(false);

  // ==========================================
  // LOAD EXISTING USER INFORMATION
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      setLoading(true);

      try {
        let existingUser = profileUser;

        if (!existingUser) {
          const storedUser =
            await AsyncStorage.getItem("user");

          existingUser = storedUser
            ? JSON.parse(storedUser)
            : null;
        }

        if (!active) return;

        if (!existingUser?._id) {
          setServerError(
            "User information could not be found."
          );
          return;
        }

        setDepartment(
          existingUser.department ?? ""
        );

        setGrade(
          existingUser.grade != null
            ? String(existingUser.grade)
            : ""
        );

        setLocation(
          existingUser.location ?? ""
        );

        setSchool(
          existingUser.institution ?? ""
        );

        setPicture(
          existingUser.picture ?? ""
        );
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );

        if (active) {
          setServerError(
            "Failed to load user information."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, [profileUser]);

  // ==========================================
  // SCHOOLS BY PROVINCE
  // ==========================================

  const schools =
    schoolsByProvince?.[location] ??
    ["Other", "None"];

  // ==========================================
  // CLEAR FIELD ERRORS
  // ==========================================

  const clearFieldError = (fieldName) => {
    setErrors((previous) => ({
      ...previous,
      [fieldName]: undefined,
    }));

    setServerError("");
  };

  // ==========================================
  // UPDATE USER
  // ==========================================


const handleSubmit = async () => {
  if (submittingRef.current) return;

  Keyboard.dismiss();

  setErrors({});
  setServerError("");

  submittingRef.current = true;
  setSubmitting(true);

  try {
    const storedUser = await AsyncStorage.getItem("user");

    const loggedUser = storedUser
      ? JSON.parse(storedUser)
      : null;

    const targetUser = profileUser ?? loggedUser;

    if (!targetUser?._id) {
      throw new Error("User ID is missing.");
    }

    // Only the five permitted fields
    const formData = {
      department,
      grade: grade === "" ? 0 : Number(grade),
      location,
      institution: school,
      picture,
    };

    const result = updateUserSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error(
        "You must be logged in to update an account."
      );
    }

    // Your actual updateUser function:
    // updateUser(userId, token, payload)
    const updatedUser = await updateUser(
  targetUser._id,
  token,
  result.data
);

    // Update local storage only for the logged-in user
    if (
      loggedUser?._id &&
      String(loggedUser._id) === String(targetUser._id)
    ) {
      const updatedLocalUser = {
        ...loggedUser,
        department: result.data.department,
        grade: result.data.grade,
        location: result.data.location,
        institution: result.data.institution,
        picture: result.data.picture,
      };

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(updatedLocalUser)
      );
    }

    Alert.alert(
      "Account Updated",
      "Your account information was updated successfully.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  } catch (error) {
    console.error("Failed to update account:", error);

    setServerError(
      error?.message ||
        "Could not update account. Please try again."
    );
  } finally {
    submittingRef.current = false;
    setSubmitting(false);
  }
};


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading account information...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
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
            <TutorVideoIcon size={90} />
          </View>

          {/* HEADER */}

          <Text style={styles.title}>
            Update Account
          </Text>

          <Text style={styles.subtitle}>
            Update your TutorVideo account information.
          </Text>

          {/* APP USE */}

          <UserDropdown
            name="Use the app for"
            data={appUses}
            value={department}
            setValue={(value) => {
              setDepartment(value);
              clearFieldError("department");
            }}
          />

          {errors.department?.[0] && (
            <Text style={styles.errorText}>
              {errors.department[0]}
            </Text>
          )}

          {/* GRADE */}

          <UserDropdown
            name="Grade"
            data={grades}
            value={grade}
            setValue={(value) => {
              setGrade(value);
              clearFieldError("grade");
            }}
          />

          {errors.grade?.[0] && (
            <Text style={styles.errorText}>
              {errors.grade[0]}
            </Text>
          )}

          {/* PROVINCE */}

          <UserDropdown
            name="Province"
            data={provinces}
            value={location}
            setValue={(value) => {
              setLocation(value);

              // Reset school when province changes
              setSchool("");

              clearFieldError("location");
              clearFieldError("institution");
            }}
          />

          {errors.location?.[0] && (
            <Text style={styles.errorText}>
              {errors.location[0]}
            </Text>
          )}

          {/* SCHOOL */}

          <UserDropdown
            name="School/Institution"
            data={schools}
            value={school}
            setValue={(value) => {
              setSchool(value);
              clearFieldError("institution");
            }}
            search
          />

          {errors.institution?.[0] && (
            <Text style={styles.errorText}>
              {errors.institution[0]}
            </Text>
          )}

          {/* PROFILE PICTURE */}

          <ImageUpload
            title="Profile Picture"
            image={picture}
            setImage={(value) => {
              setPicture(value);
              clearFieldError("picture");
            }}
            folder={`Tutorvideo-profile-Pictures/${
              profileUser?._id ?? "users"
            }`}
          />

          {errors.picture?.[0] && (
            <Text style={styles.errorText}>
              {errors.picture[0]}
            </Text>
          )}

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
            title="Update Account"
            submittingText="Updating account..."
            onPress={handleSubmit}
            submitting={submitting}
            disabled={submitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
    width: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 120,
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
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 6,
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef3f8",
  },

  loadingText: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 12,
  },
});

export default UpdateUser;
