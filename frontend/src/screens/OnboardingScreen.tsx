import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MindFlowMark } from "../components/MindFlowMark";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { TextReveal } from "../components/TextReveal";
import { RootStackParamList } from "../navigation/types";
import { colors, spacing, typography } from "../theme/tokens";

type RouteName = keyof RootStackParamList;

type Props = NativeStackScreenProps<RootStackParamList> & {
  step: string;
  title: string;
  body: string;
  action: string;
  next: RouteName;
};

export function OnboardingScreen({ navigation, step, title, body, action, next }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 900;
  const titleSize = isMobile ? 28 : 56;
  const titleLineHeight = isMobile ? 36 : 62;
  const bodySize = isMobile ? 16 : 34;
  const bodyLineHeight = isMobile ? 24 : 44;

  return (
    <ScreenShell>
      <View style={[styles.topRow, isDesktop && styles.containerDesktop]}>
        <MindFlowMark size={42} />
        <Text style={styles.step}>{step}</Text>
      </View>
      <View style={[styles.copy, isDesktop && styles.containerDesktop]}>
        <TextReveal style={[styles.title, { fontSize: titleSize, lineHeight: titleLineHeight }]}>
          {title}
        </TextReveal>
        <Text style={[styles.body, { fontSize: bodySize, lineHeight: bodyLineHeight }]}>{body}</Text>
      </View>
      <View style={isDesktop && styles.containerDesktop}>
        <PrimaryButton onPress={() => navigation.navigate(next)}>{action}</PrimaryButton>
      </View>
      <View style={isDesktop && styles.containerDesktop}>
        <PrimaryButton variant="ghost" onPress={() => navigation.navigate("Login")}>
          I already have an account
        </PrimaryButton>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  step: {
    ...typography.caption,
    color: colors.faint
  },
  containerDesktop: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center"
  },
  copy: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg
  },
  title: {
    ...typography.title,
    color: colors.white,
    fontWeight: "800",
    maxWidth: 700
  },
  body: {
    ...typography.body,
    color: "#e6eadf",
    maxWidth: 520
  }
});
