import { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { motion } from "../animations/motion";

type Props = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedPressable({ children, style, onPressIn, onPressOut, ...props }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }]
  }));

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        scale.value = withTiming(0.97, { duration: motion.pressIn });
        opacity.value = withTiming(0.92, { duration: motion.pressIn });
        translateY.value = withTiming(1.5, { duration: motion.pressIn });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220, mass: 0.5 });
        opacity.value = withTiming(1, { duration: motion.pressOut });
        translateY.value = withSpring(0, { damping: 12, stiffness: 220, mass: 0.5 });
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
