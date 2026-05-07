import { ReactNode, useEffect } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";
import { motion } from "../animations/motion";

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
};

function Word({ children, index, style }: { children: ReactNode; index: number; style?: StyleProp<TextStyle> }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(index * motion.wordStagger, withTiming(1, { duration: 520 }));
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 10 }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style}>{children} </Text>
    </Animated.View>
  );
}

export function TextReveal({ children, style }: Props) {
  const words = children.replace(/\s+/g, " ").trim().split(" ");

  return (
    <View style={styles.wrap}>
      {words.map((word, index) => (
        <Word key={`${word}-${index}`} index={index} style={style}>
          {word}
        </Word>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
