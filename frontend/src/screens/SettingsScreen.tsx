import { useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const initialSettings = [
  "Gentle session bell",
  "Word-by-word reveal",
  "Blur transitions",
  "Private analytics",
  "Weekly reflection"
];

export function SettingsScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const [enabled, setEnabled] = useState([true, true, true, false, false]);

  return (
    <ScreenShell>
      <AnimatedPressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </AnimatedPressable>
      <Text style={[styles.title, isMobile && styles.titleMobile]}>Settings.</Text>
      <View style={styles.list}>
        {initialSettings.map((item, index) => (
          <AnimatedPressable
            key={item}
            style={[styles.row, isMobile && styles.rowMobile]}
            onPress={() =>
              setEnabled((values) => values.map((value, i) => (i === index ? !value : value)))
            }
          >
            <Text style={styles.rowLabel}>{item}</Text>
            <View style={[styles.toggle, enabled[index] && styles.toggleOn]}>
              <View style={[styles.knob, enabled[index] && styles.knobOn]} />
            </View>
          </AnimatedPressable>
        ))}
      </View>

      <View style={styles.bottom}>
        <PrimaryButton variant="ghost" onPress={() => navigation.navigate("Profile")}>
          View profile
        </PrimaryButton>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backButton: {
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
  title: {
    ...typography.display,
    color: colors.white,
    marginTop: spacing["2xl"]
  },
  titleMobile: {
    fontSize: 44,
    lineHeight: 50,
    marginTop: spacing.lg
  },
  list: {
    gap: spacing.md,
    marginTop: spacing["3xl"]
  },
  row: {
    minHeight: 68,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowMobile: {
    minHeight: 60,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md
  },
  rowLabel: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  toggle: {
    width: 46,
    height: 28,
    borderRadius: 28,
    backgroundColor: "#7f8875",
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)"
  },
  toggleOn: {
    backgroundColor: "#f2f4ee",
    borderColor: "rgba(255,255,255,0.8)"
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#f4f6f1",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)"
  },
  knobOn: {
    transform: [{ translateX: 18 }],
    backgroundColor: "#1f271f",
    borderColor: "rgba(255,255,255,0.5)"
  },
  bottom: {
    marginTop: "auto"
  }
});
