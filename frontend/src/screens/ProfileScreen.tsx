import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { MindFlowMark } from "../components/MindFlowMark";
import { MetricCard } from "../components/MetricCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, radius, shadows, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export function ProfileScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const user = useMindFlowStore((state) => state.user);
  const logout = useMindFlowStore((state) => state.logout);
  const stats = useMindFlowStore((state) => state.stats);

  function handleLogout() {
    logout();
    navigation.replace("Login");
  }

  return (
    <ScreenShell>
      <AnimatedPressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </AnimatedPressable>
      <View style={[styles.hero, isMobile && styles.heroMobile]}>
        <MindFlowMark size={58} />
        <Text style={[styles.name, isMobile && styles.nameMobile]}>Abduallah Elbarbary</Text>
        <Text style={styles.email}>{user?.email ?? "elbarbaryabduallah@gmail.com"}</Text>
      </View>

      <View style={styles.metrics}>
        <MetricCard value={`${stats.completedSessions}`} label="Sessions" />
        <MetricCard value={`${stats.notesCount}`} label="Notes" accent />
      </View>

      <View style={styles.win}>
        <Text style={styles.winTitle}>Latest win</Text>
        <Text style={styles.winBody}>
          Completed a full 42 minute design sprint without switching context.
        </Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton variant="ghost" onPress={handleLogout}>
          Log out
        </PrimaryButton>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    borderRadius: radius.md,
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
  hero: {
    marginTop: spacing["2xl"],
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing["2xl"],
    gap: spacing.lg,
    ...shadows.panel
  },
  heroMobile: {
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl
  },
  name: {
    ...typography.title,
    color: colors.white
  },
  nameMobile: {
    fontSize: 22,
    lineHeight: 28
  },
  email: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20
  },
  metrics: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing["2xl"]
  },
  win: {
    marginTop: spacing["2xl"],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl
  },
  winTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  winBody: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm
  },
  bottom: {
    marginTop: "auto"
  }
});
