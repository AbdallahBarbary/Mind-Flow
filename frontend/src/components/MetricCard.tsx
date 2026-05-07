import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing } from "../theme/tokens";

type Props = {
  value: string;
  label: string;
  accent?: boolean;
};

export function MetricCard({ value, label, accent }: Props) {
  return (
    <View style={[styles.card, accent && styles.accent]}>
      <Text style={[styles.value, accent && styles.accentText]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 128,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    justifyContent: "space-between",
    ...shadows.panel
  },
  accent: {
    borderColor: colors.accent
  },
  value: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800"
  },
  accentText: {
    color: colors.accent
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  }
});
