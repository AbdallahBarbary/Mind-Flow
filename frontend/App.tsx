import "react-native-gesture-handler";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setAuthToken } from "./src/services/api";
import { useMindFlowStore } from "./src/store/useMindFlowStore";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  const token = useMindFlowStore((state) => state.token);
  const hydrateSession = useMindFlowStore((state) => state.hydrateSession);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.backgroundColor = "#000000";
      document.body.style.backgroundColor = "#000000";
      document.getElementById("root")?.style.setProperty("background-color", "#000000");
    }
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
