import { useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { Field } from "../components/Field";
import { MindFlowMark } from "../components/MindFlowMark";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const login = useMindFlowStore((state) => state.login);
  const isLoading = useMindFlowStore((state) => state.isLoading);
  const [email, setEmail] = useState("hello@mindflow.app");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    try {
      await login(email, password);
      navigation.replace("Home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Wrong email or password.");
          return;
        }
        if (error.response?.status === 404) {
          setError("Account not found. Create a new account first.");
          return;
        }
      }
      setError("Could not reach backend. Make sure API is running on port 4000.");
    }
  }

  return (
    <ScreenShell>
      <View style={[styles.header, !isMobile && styles.containerDesktop]}>
        <MindFlowMark size={46} />
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Welcome back.</Text>
        <Text style={styles.body}>Return to the room you left inside your thoughts.</Text>
      </View>
      <View style={[styles.form, !isMobile && styles.containerDesktop]}>
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={[styles.actions, !isMobile && styles.containerDesktop]}>
        <PrimaryButton disabled={isLoading} onPress={handleLogin}>
          Log in
        </PrimaryButton>
        <PrimaryButton variant="ghost" onPress={() => navigation.navigate("Register")}>
          Create new account
        </PrimaryButton>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing["4xl"],
    gap: spacing.lg
  },
  containerDesktop: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center"
  },
  title: {
    ...typography.display,
    color: colors.white
  },
  titleMobile: {
    fontSize: 54,
    lineHeight: 60
  },
  body: {
    ...typography.body,
    color: colors.muted,
    maxWidth: 310
  },
  form: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg
  },
  actions: {
    gap: spacing.md
  },
  error: {
    color: colors.accentSoft,
    fontSize: 13,
    lineHeight: 20
  }
});
