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
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

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

  const progress = (sessionSeconds - remaining) / sessionSeconds;
  const shrink = useSharedValue(0);
  const dialSize = isMobile ? 156 : 176;

  useEffect(() => {
    shrink.value = withTiming(progress, { duration: 220 });
  }, [progress, shrink]);

  const treeStyle = useAnimatedStyle(() => {
    const p = shrink.value;
    const scale = 0.92 - p * 0.36;
    return {
      transform: [{ translateY: p * 10 }, { scale }]
    };
  });

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
        <View style={{ width: dialSize, height: dialSize }}>
          <TimerDial progress={progress} size={dialSize} />
          <Animated.View pointerEvents="none" style={[styles.treeInDial, treeStyle]}>
            <TreeSvg />
          </Animated.View>
        </View>
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

function TreeSvg() {
  return (
    <Svg width={128} height={128} viewBox="0 0 140 140">
      <Rect x="62" y="74" width="16" height="34" rx="7" fill="rgba(31,39,31,0.9)" />
      <Path
        d="M70 16c16 16 30 34 30 46 0 14-13 24-30 24S40 76 40 62c0-12 14-30 30-46Z"
        fill="rgba(240,241,237,0.35)"
      />
      <Path
        d="M70 26c13 13 24 28 24 38 0 11-11 19-24 19s-24-8-24-19c0-10 11-25 24-38Z"
        fill="rgba(240,241,237,0.55)"
      />
      <Path
        d="M70 38c10 10 18 21 18 29 0 8-8 14-18 14s-18-6-18-14c0-8 8-19 18-29Z"
        fill="rgba(240,241,237,0.78)"
      />
    </Svg>
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
  treeInDial: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -64,
    marginTop: -64
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
