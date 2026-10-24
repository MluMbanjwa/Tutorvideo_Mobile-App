
import { useCallback, useState } from "react";

import {
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ProfilePicture from "../ReUsableComponents/view/PictureView";
import Details from "../ReUsableComponents/view/profileDetails";

const UserProfile = ({ route }) => {
  const navigation = useNavigation();

  const [adminAccess, setAdminAccess] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // User passed through navigation.
  // If absent, display the logged-in user's profile.
  const profileUser = route?.params?.user;

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadProfile = async () => {
        setLoading(true);

        try {
          const storedUser =
            await AsyncStorage.getItem("user");

          if (!active) return;

          const loggedUser = storedUser
            ? JSON.parse(storedUser)
            : null;

          const viewedUser =
            profileUser ?? loggedUser;

          setUser(viewedUser);

          const privilegedRoles = [
            "admin",
            "owner",
            "tutor",
          ];

          const role = loggedUser?.role;

          const hasPrivilegedRole =
            privilegedRoles.includes(role);

          const isOwnProfile =
            Boolean(loggedUser?._id) &&
            Boolean(viewedUser?._id) &&
            String(loggedUser._id) ===
              String(viewedUser._id);

          // Controls visibility of sensitive details.
          setAdminAccess(
            hasPrivilegedRole || isOwnProfile
          );

          // Admins and owners can edit other users.
          // Other users can edit only their own profiles.
          const canEditOthers = [
            "admin",
            "owner",
          ].includes(role);

          setCanEdit(
            Boolean(
              loggedUser &&
              viewedUser &&
              (isOwnProfile || canEditOthers)
            )
          );
        } catch (error) {
          console.error(
            "Failed to load profile:",
            error
          );

          if (active) {
            setUser(null);
            setAdminAccess(false);
            setCanEdit(false);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadProfile();

      return () => {
        active = false;
      };
    }, [profileUser])
  );

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleUpdate = () => {
    if (!user || !canEdit) return;

    navigation.navigate("UpdateUser", {
      user,
    });
  };
const handleChangePassword=async()=>{
   if (!user || !canEdit) return;
  const token=await AsyncStorage.getItem("token");
    navigation.navigate("ChangePassword", {
      user,
      token
    });
}
  // ==========================================
  // PROFILE INFORMATION
  // ==========================================

  const sensitiveInfo = {
    Role:
      user?.role ??
      user?.department ??
      "Not provided",

    Province:
      user?.location ?? "Not provided",

    "Phone Number":
      user?.phone ?? "Not provided",

    Email:
      user?.email ?? "Not provided",

    Institution:
      user?.institution ?? "Not provided",

    Grade:
      user?.grade ?? "Not provided",
  };

  const publicInfo = {
    Role:
      user?.role ??
      user?.department ??
      "Not provided",

    Province:
      user?.location ?? "Not provided",

    Institution:
      user?.institution ?? "Not provided",

    Grade:
      user?.grade ?? "Not provided",
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // ==========================================
  // NO PROFILE
  // ==========================================

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <FontAwesome5
          name="user-circle"
          size={55}
          color="#94A3B8"
        />

        <Text style={styles.emptyTitle}>
          Profile Unavailable
        </Text>

        <Text style={styles.emptyDescription}>
          No user profile could be found.
        </Text>
      </View>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
      {/* PROFILE PICTURE */}

      <ProfilePicture
        title={
          `${user.name ?? ""} ${user.surname ?? ""}`.trim() ||
          "User Profile"
        }
        url={user.picture}
      />

      {/* PROFILE DETAILS */}

      <Details
        data={
          adminAccess
            ? sensitiveInfo
            : publicInfo
        }
        title={
          adminAccess
            ? "Account Information"
            : "Account Public Information"
        }
      />
      {/* UPDATE PROFILE BUTTON */}

     <View style={styles.btnContainer}>
       {canEdit && (
        <Pressable
          onPress={handleUpdate}
          style={({ pressed }) => [
            styles.updateButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Update Profile"
        >
          <FontAwesome5
            name="user-edit"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.updateButtonText}>
            Update Personal details
          </Text>

          <FontAwesome5
            name="arrow-right"
            size={14}
            color="#FFFFFF"
          />
        </Pressable>
        
      )}
      {canEdit && (
        <Pressable
          onPress={handleChangePassword}
          style={({ pressed }) => [
            styles.updateButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Update Profile"
        >
          <FontAwesome5
            name="key"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.updateButtonText}>
            Change password
          </Text>

          <FontAwesome5
            name="arrow-right"
            size={14}
            color="#FFFFFF"
          />
        </Pressable>
      )}
     </View>

    </ScrollView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
    marginBottom:50,

  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    alignItems: "stretch",
  },

  // UPDATE BUTTON

  updateButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,

    paddingVertical: 16,
    paddingHorizontal: 20,

    borderRadius: 12,
    marginTop: 0,
    width: "100%",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 3,
  },

  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
btnContainer:{
  gap:10,
},
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  // LOADING

  loadingContainer: {
    flex: 1,
    backgroundColor: "#eef3f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: "#64748B",
  },

  // EMPTY PROFILE

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 15,
  },

  emptyDescription: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
});

export default UserProfile;
