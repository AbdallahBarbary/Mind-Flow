import { useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { Field } from "../components/Field";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const register = useMindFlowStore((state) => state.register);
  const isLoading = useMindFlowStore((state) => state.isLoading);
  const [email, setEmail] = useState("you@domain.com");
  const [password, setPassword] = useState("password123");
  const [goal, setGoal] = useState("45 minutes");
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");
    try {
      await register(email, password);
      navigation.replace("Home");
    } catch {
      setError("Backend unavailable or this email already exists.");
    }
  }

  return (
    <ScreenShell>
      <AnimatedPressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </AnimatedPressable>
      <View style={[styles.header, !isMobile && styles.containerDesktop]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Create a quieter workflow.</Text>
        <Text style={[styles.body, isMobile && styles.bodyMobile]}>
          One account for notes, focus sessions, and weekly clarity.
        </Text>
      </View>
      <View style={[styles.form, !isMobile && styles.containerDesktop]}>
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Field label="Daily focus goal" value={goal} onChangeText={setGoal} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={!isMobile && styles.containerDesktop}>
        <PrimaryButton disabled={isLoading} onPress={handleRegister}>
          Start MindFlow
        </PrimaryButton>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    borderRadius: 16,
    backgroundColor: "rgba(28, 35, 28, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  backText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  header: {
    paddingTop: spacing["3xl"],
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
    fontSize: 44,
    lineHeight: 50
  },
  body: {
    ...typography.body,
    color: colors.muted,
    maxWidth: 314
  },
  bodyMobile: {
    fontSize: 14,
    lineHeight: 20
  },
  form: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg
  },
  error: {
    color: colors.accentSoft,
    fontSize: 13,
    lineHeight: 20
  }
});
