import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";

type Props = TextInputProps & {
  label: string;
};

export function Field({ label, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        placeholderTextColor={colors.faint}
        selectionColor={colors.accent}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 76,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs
  },
  label: {
    color: colors.faint,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700"
  },
  input: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    padding: 0
  }
});
