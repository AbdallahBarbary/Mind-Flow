import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenShell } from "../components/ScreenShell";
import { MindFlowMark } from "../components/MindFlowMark";
import { colors, spacing, typography } from "../theme/tokens";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const handle = setTimeout(() => navigation.replace("OnboardingOne"), 1100);
    return () => clearTimeout(handle);
  }, [navigation]);

  return (
    <ScreenShell>
      <View style={styles.center}>
        <MindFlowMark size={68} />
        <Text style={styles.title}>MindFlow</Text>
        <Text style={styles.subtitle}>A quiet place for thought.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl
  },
  title: {
    ...typography.display,
    color: colors.white,
    textAlign: "center"
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
    textAlign: "center"
  }
});
