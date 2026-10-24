
import { useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UserInput from "../../ReUsableComponents/inputs/UserInput";
import UserDropdown from "../../ReUsableComponents/inputs/UserComboBox";

import {
  grades,
  provinces,
  appUses,
} from "../subComponents/Variables";

import schoolsByProvince from "../subComponents/SchoolsByProvince/schoolsByProvince";

import ImageUpload from "../../ReUsableComponents/inputs/ImageUploader";
import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton";

import { createUser } from "../../../DataFetching/Users";
import TutorVideoIcon from "../../ReUsableComponents/view/TutorVideoIcon";

// ==========================================
// VALIDATION SCHEMA
// ==========================================

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    surname: z
      .string()
      .trim()
      .min(2, "Surname must be at least 2 characters")
      .max(50, "Surname is too long"),

    department: z
      .string()
      .min(1, "Please select how you will use the app"),

    location: z
      .string()
      .min(1, "Please select a province"),

    phone: z
      .string()
      .trim()
      .regex(
        /^(\+27|0)[6-8][0-9]{8}$/,
        "Enter a valid South African cellphone number"
      ),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    institution: z
      .string()
      .min(1, "Please select your school"),

    grade: z
      .number()
      .int()
      .min(1, "Please select a grade"),

    picture: z
      .string()
      .min(1, "Please upload a profile picture")
      .url("Picture must be a valid URL"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

// ==========================================
// SIGNUP COMPONENT
// ==========================================

const SignUp = ({ navigation }) => {
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [picture, setPicture] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const submittingRef = useRef(false);

  // ==========================================
  // SCHOOLS BY PROVINCE
  // ==========================================

  const schools =
    schoolsByProvince[location] || ["Other", "None"];

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

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    Keyboard.dismiss();

    setErrors({});
    setServerError("");

    const formData = {
      name,
      surname,
      department,
      location,
      phone,
      email,
      password,
      confirmPassword,
      institution: school,
      grade: grade === "" ? 0 : Number(grade),
      picture,
    };

    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const {
      confirmPassword: _confirmPassword,
      ...userData
    } = result.data;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await createUser(userData);

      Alert.alert(
        "Account created",
        "Your account was created successfully."
      );

      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Could not create user:", error);

      setServerError(
        error?.message ||
          "Could not create your account. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={signupStyles.container}>
      <KeyboardAwareScrollView
        style={signupStyles.container}
        contentContainerStyle={signupStyles.scrollContainer}
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
        <View style={signupStyles.formCard}>
          <Text style={signupStyles.title}>
            Create Account
          </Text>
          <Text style={signupStyles.subtitle}>
            <TutorVideoIcon size={100}/>
          </Text>
          <Text style={signupStyles.subtitle}>
            Enter your details to sign up.
          </Text>

          {/* SURNAME */}

          <UserInput
            name="Surname"
            value={surname}
            setValue={(value) => {
              setSurname(value);
              clearFieldError("surname");
            }}
            autoCapitalize="words"
          />

          {errors.surname?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.surname[0]}
            </Text>
          )}

          {/* NAME */}

          <UserInput
            name="Name"
            value={name}
            setValue={(value) => {
              setName(value);
              clearFieldError("name");
            }}
            autoCapitalize="words"
          />

          {errors.name?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.name[0]}
            </Text>
          )}

          {/* PHONE */}

          <UserInput
            name="Phone number (WhatsApp)"
            value={phone}
            setValue={(value) => {
              setPhone(value);
              clearFieldError("phone");
            }}
            inputMode="tel"
          />

          {errors.phone?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.phone[0]}
            </Text>
          )}

          {/* EMAIL */}

          <UserInput
            name="Email"
            value={email}
            setValue={(value) => {
              setEmail(value);
              clearFieldError("email");
            }}
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {errors.email?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.email[0]}
            </Text>
          )}

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
            <Text style={signupStyles.errorText}>
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
            <Text style={signupStyles.errorText}>
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
              setSchool("");
              clearFieldError("location");
              clearFieldError("institution");
            }}
          />

          {errors.location?.[0] && (
            <Text style={signupStyles.errorText}>
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
            <Text style={signupStyles.errorText}>
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
            folder={`Tutorvideo-profile-Pictures/${email}`}
          />

          {errors.picture?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.picture[0]}
            </Text>
          )}

          {/* PASSWORD */}

          <UserInput
            name="Password"
            value={password}
            setValue={(value) => {
              setPassword(value);
              clearFieldError("password");
              clearFieldError("confirmPassword");
            }}
            secureTextEntry
          />

          {errors.password?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.password[0]}
            </Text>
          )}

          {/* CONFIRM PASSWORD */}

          <UserInput
            name="Confirm Password"
            value={confirmPassword}
            setValue={(value) => {
              setConfirmPassword(value);
              clearFieldError("confirmPassword");
            }}
            secureTextEntry
          />

          {errors.confirmPassword?.[0] && (
            <Text style={signupStyles.errorText}>
              {errors.confirmPassword[0]}
            </Text>
          )}

          {/* SERVER ERROR */}

          {serverError ? (
            <View style={signupStyles.serverErrorContainer}>
              <Text style={signupStyles.serverErrorText}>
                {serverError}
              </Text>
            </View>
          ) : null}

          {/* SUBMIT */}

          <SubmitButton
            title="Create Account"
            submittingText="Creating account..."
            onPress={handleSubmit}
            submitting={submitting}
          />

          {/* SIGN IN */}

          <Text style={signupStyles.subtitle}>
            Already have an account?{" "}
            <Text
              style={signupStyles.navigate}
              onPress={() => navigation.navigate("SignIn")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// STYLES
// ==========================================

const signupStyles = StyleSheet.create({
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
    paddingBottom: 40,
  },

  formCard: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 22,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom:100,
    elevation: 5,
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
    marginBottom: 18,
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

  navigate: {
    color: "#3eb91c",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default SignUp;
