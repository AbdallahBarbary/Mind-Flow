import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { colors, radius, shadows, spacing } from "../theme/tokens";
import { motion } from "../animations/motion";

type Props = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ children, variant = "primary", disabled, onPress, style }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }]
  }));

  const isPrimary = variant === "primary";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: motion.pressIn });
        opacity.value = withTiming(0.92, { duration: motion.pressIn });
        translateY.value = withTiming(1.5, { duration: motion.pressIn });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220, mass: 0.5 });
        opacity.value = withTiming(1, { duration: motion.pressOut });
        translateY.value = withSpring(0, { damping: 12, stiffness: 220, mass: 0.5 });
      }}
    >
      <Animated.View
        style={[
          styles.button,
          isPrimary ? styles.primary : styles.ghost,
          disabled && styles.disabled,
          style,
          animatedStyle
        ]}
      >
        <Text
          style={[
            styles.label,
            isPrimary ? styles.primaryLabel : styles.ghostLabel,
            disabled && styles.disabledLabel
          ]}
        >
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"]
  },
  primary: {
    backgroundColor: colors.accent,
    ...shadows.glow
  },
  ghost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  label: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#1f251f"
  },
  ghostLabel: {
    color: "#f2f4ee"
  },
  disabled: {
    opacity: 0.55
  },
  disabledLabel: {
    color: colors.faint
  }
});
