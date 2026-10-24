
import { useCallback, useEffect, useState } from "react";

import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";

import Screens from "./Components/NavBar/Screens/Screens";
import NavBar from "./Components/NavBar/NavigationBar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { subscribeAuthChange } from "./AuthEvents";

const navigationRef = createNavigationContainerRef();

export default function App() {
  const [user, setUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState("Home");
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!mounted) return;

        setUser(
          storedUser ? JSON.parse(storedUser) : null
        );
      } catch (error) {
        console.error("Authentication error:", error);

        if (mounted) setUser(null);
      }
    };

    checkAuth();

    const unsubscribe = subscribeAuthChange(checkAuth);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useCallback((screen, params) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(screen, params);
    }
  }, []);

  const resetTo = useCallback((screen) => {
    if (navigationRef.isReady()) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: screen }],
      });
    }
  }, []);

  const updateCurrentRoute = useCallback(() => {
    if (navigationRef.isReady()) {
      setCurrentRoute(
        navigationRef.getCurrentRoute()?.name ?? "Home"
      );
    }
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={updateCurrentRoute}
      onStateChange={updateCurrentRoute}
    >
      <Screens />

      <NavBar
        user={user}
        currentRoute={currentRoute}
        navigate={navigate}
        resetTo={resetTo}
    
      />
    </NavigationContainer>
  );
}
