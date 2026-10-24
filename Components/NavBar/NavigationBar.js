
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
  subscribeAuthChange,
  notifyAuthChange,
} from "../../AuthEvents";
import { fetchUser } from "../../DataFetching/Users";

// ==========================================
// NAVIGATION ITEM
// ==========================================

const NavItem = ({
  name,
  text,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.glowContainer}>
        {active && (
          <View style={styles.glowCircle} />
        )}

        <View
          style={[
            styles.iconCircle,
            active && styles.activeCircle,
          ]}
        >
          <FontAwesome5
            name={name}
            size={22}
            color={active ? "#ffffff" : "#2563eb"}
            solid={active}
          />
        </View>
      </View>

      <Text
        style={[
          styles.navText,
          active && styles.activeText,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

// ==========================================
// NAVBAR
// ==========================================

const NavBar = ({
  user,
  currentRoute = "Home",
  navigate,
  resetTo,
}) => {
  const [grade, setGrade] = useState(12);
  const [term, setTerm] = useState(1);

  // ==========================================
  // ACTIVE TAB
  // ==========================================

const getActiveTab = (screen) => {
  const routes = {
    Home: "Home",

    Topics: "Study",
    Subtopics: "Study",
    SubTopics: "Study",
    WatchTopic: "Study",
    Test: "Study",

    YearReport: "Report",
    TermReport: "Report",
    TopicReport: "Report",

    Profile: "Profile",
    UpdateUser:"Profile",
    ChangePassword:"Profile",

    SignIn: "SignIn",
    SignUp: "SignIn",
  };

  return routes[screen] ?? "Home";
};

  const activeTab = getActiveTab(currentRoute);

  // ==========================================
  // LOAD GRADE AND TERM
  // ==========================================

  const loadPreferences = useCallback(async () => {
    try {
      const [storedGrade, storedTerm] =
        await Promise.all([
          AsyncStorage.getItem("grade"),
          AsyncStorage.getItem("term"),
        ]);

      setGrade(
        storedGrade !== null
          ? Number(storedGrade)
          : Number(user?.grade ?? 12)
      );

      setTerm(
        storedTerm !== null
          ? Number(storedTerm)
          : Number(user?.term ?? 1)
      );
    } catch (error) {
      console.error(
        "Failed to load preferences:",
        error
      );
    }
  }, [user]);

  // ==========================================
  // REFRESH PREFERENCES
  // ==========================================

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences, currentRoute]);

  useEffect(() => {
    return subscribeAuthChange(loadPreferences);
  }, [loadPreferences]);

  // ==========================================
  // NORMAL NAVIGATION
  // ==========================================

  const handleNavigation = (screen) => {
    navigate(screen);
  };

  // ==========================================
  // REPORT NAVIGATION
  // ==========================================

  const handleReport = async (name) => {
    try {
      
    const token=await AsyncStorage.getItem("token");
      const [
        storedUser,
        storedGrade,
        storedTerm,
      ] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("grade"),
        AsyncStorage.getItem("term"),
      ]);
      if (!storedUser) {
        navigate("SignIn");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
       const user=await fetchUser(parsedUser._id,token);
      const selectedGrade =
        storedGrade !== null
          ? Number(storedGrade)
          : Number(parsedUser.grade ?? grade);

      const selectedTerm =
        storedTerm !== null
          ? Number(storedTerm)
          : term;
      navigate(name, {
        user: user,
        grade: selectedGrade,
        term: selectedTerm,
      });
    } catch (error) {
      console.error(
        "Failed to open report:",
        error
      );
    }
  };

  // ==========================================
  // STUDY NAVIGATION
  // ==========================================

  const handleStudy = async () => {
    try {
      const [
        storedGrade,
        storedTerm,
      ] = await Promise.all([
        AsyncStorage.getItem("grade"),
        AsyncStorage.getItem("term"),
      ]);

      const selectedGrade =
        storedGrade !== null
          ? Number(storedGrade)
          : grade;

      const selectedTerm =
        storedTerm !== null
          ? Number(storedTerm)
          : term;

      navigate("Topics", {
        grade: selectedGrade,
        term: selectedTerm,
      });
    } catch (error) {
      console.error(
        "Failed to open topics:",
        error
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user",
        "token",
        "grade",
        "term",
      ]);

      setGrade(12);
      setTerm(1);

      // Tell App.js to update the user state
      notifyAuthChange();

      // Clear navigation history and open login
      resetTo("SignIn");
    } catch (error) {
      console.error(
        "Failed to log out:",
        error
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={styles.container}
    >
      <NavItem
        name="home"
        text="Home"
        active={activeTab === "Home"}
        onPress={() => handleNavigation("Home")}
      />

      <NavItem
        name="book"
        text="Study"
        active={activeTab === "Study"}
        onPress={handleStudy}
      />

      <NavItem
        name="chart-bar"
        text="My Report"
        active={activeTab === "Report"}
        onPress={() => handleReport("YearReport")}
      />

      <NavItem
        name="user"
        text="Account"
        active={activeTab === "Profile"}
        onPress={() => handleNavigation("Profile")}
      />

      {user ? (
        <NavItem
          name="sign-out-alt"
          text="Log Out"
          active={false}
          onPress={handleLogout}
        />
      ) : (
        <NavItem
          name="sign-in-alt"
          text="Log In"
          active={activeTab === "SignIn"}
          onPress={() => handleNavigation("SignIn")}
        />
      )}
    </SafeAreaView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    paddingTop: 8,
    paddingHorizontal: 4,

    backgroundColor: "#ffffff",

    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",

    elevation: 8,
  },

  navItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
  },

  glowContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  glowCircle: {
    position: "absolute",

    width: 62,
    height: 62,
    borderRadius: 31,

    backgroundColor: "rgba(37, 99, 235, 0.18)",

    borderWidth: 2,
    borderColor: "rgba(37, 99, 235, 0.25)",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "transparent",
  },

  activeCircle: {
    backgroundColor: "#2563eb",
    borderWidth: 0,
    borderRadius:24,
    shadowOpacity: 1,
    shadowRadius: 14,

    elevation: 10,
  },

  navText: {
    marginTop: 0,
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
  },

  activeText: {
    color: "#2563eb",
    fontWeight: "700",
  },
});

export default NavBar;
