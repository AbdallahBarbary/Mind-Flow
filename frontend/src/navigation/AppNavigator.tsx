import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme/tokens";
import { RootStackParamList } from "./types";
import { SplashScreen } from "../screens/SplashScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { BrainDumpScreen } from "../screens/BrainDumpScreen";
import { FocusScreen } from "../screens/FocusScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.black,
    card: colors.black,
    text: colors.white,
    border: colors.border,
    primary: colors.accent
  }
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.black }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingOne">
          {(props) => (
            <OnboardingScreen
              {...props}
              step="01/03"
              title="Quiet the mind without forcing it."
              body="Start with one soft prompt. No streak pressure, no noisy dashboards, no race against yourself."
              action="Begin"
              next="OnboardingTwo"
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="OnboardingTwo">
          {(props) => (
            <OnboardingScreen
              {...props}
              step="02/03"
              title="Write the noise down. Leave the signal."
              body="Brain dump captures unfiltered thoughts, then lets you shape what deserves attention."
              action="Next"
              next="OnboardingThree"
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="OnboardingThree">
          {(props) => (
            <OnboardingScreen
              {...props}
              step="03/03"
              title="Enter focus slowly. Return gently."
              body="A cinematic timer and calm analytics make productivity feel private and restorative."
              action="Create account"
              next="Register"
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Notes" component={BrainDumpScreen} />
        <Stack.Screen name="Focus" component={FocusScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
