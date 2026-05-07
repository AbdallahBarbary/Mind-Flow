import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomNav } from "../components/BottomNav";
import { FadeInView } from "../components/FadeInView";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { TimerDial } from "../components/TimerDial";
import { RootStackParamList } from "../navigation/types";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, radius, shadows, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Focus">;

const sessionSeconds = 42 * 60;

export function FocusScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const completeFocusSession = useMindFlowStore((state) => state.completeFocusSession);
  const [remaining, setRemaining] = useState(sessionSeconds);
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;
    const handle = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(handle);
  }, [isRunning]);

  const time = useMemo(() => {
    const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remaining]);

  async function handleComplete() {
    try {
      await completeFocusSession(Math.round((sessionSeconds - remaining) / 60) || 42);
    } finally {
      navigation.navigate("Stats");
    }
  }

  return (
    <ScreenShell>
      <FadeInView>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Deep focus.</Text>
        <Text style={[styles.intent, isMobile && styles.intentMobile]}>Designing the notes surface</Text>
      </FadeInView>

      <FadeInView delay={100} style={[styles.timer, isMobile && styles.timerMobile]}>
        <TimerDial progress={(sessionSeconds - remaining) / sessionSeconds} />
        <Text style={[styles.time, isMobile && styles.timeMobile]}>{time}</Text>
        <Text style={styles.caption}>{isRunning ? "Slow start · bell off" : "Ready when you are"}</Text>
      </FadeInView>

      <FadeInView delay={180} style={[styles.actions, isMobile && styles.actionsMobile]}>
        <PrimaryButton variant="ghost" style={styles.half} onPress={() => setRunning((value) => !value)}>
          {isRunning ? "Pause" : "Start"}
        </PrimaryButton>
        <PrimaryButton style={styles.half} onPress={handleComplete}>
          Complete
        </PrimaryButton>
      </FadeInView>

      <View style={styles.bottom}>
        <BottomNav active="Focus" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    color: colors.white,
    marginTop: spacing["4xl"]
  },
  titleMobile: {
    fontSize: 44,
    lineHeight: 50,
    marginTop: spacing["2xl"]
  },
  intent: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm
  },
  intentMobile: {
    fontSize: 14,
    lineHeight: 20
  },
  timer: {
    marginTop: spacing["4xl"],
    minHeight: 340,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    ...shadows.glow
  },
  timerMobile: {
    marginTop: spacing["2xl"],
    minHeight: 280,
    borderRadius: radius.xl,
    gap: spacing.md,
    paddingVertical: spacing.xl
  },
  time: {
    color: colors.white,
    fontSize: 54,
    lineHeight: 60,
    fontWeight: "800"
  },
  timeMobile: {
    fontSize: 42,
    lineHeight: 48
  },
  caption: {
    ...typography.caption,
    color: colors.muted
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing["2xl"]
  },
  actionsMobile: {
    marginTop: spacing.lg
  },
  half: {
    flex: 1
  },
  bottom: {
    marginTop: "auto"
  }
});
