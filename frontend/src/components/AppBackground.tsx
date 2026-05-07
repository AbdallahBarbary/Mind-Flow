import { ReactNode, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/tokens";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { useMindFlowStore } from "../store/useMindFlowStore";

type Props = {
  children: ReactNode;
};

type Drop = {
  id: string;
  left: number;
  top: number;
  height: number;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
};

function RainLayer({ intensity = 28, active }: { intensity?: number; active: boolean }) {
  const { width, height } = useWindowDimensions();
  const visible = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    visible.value = withTiming(active ? 1 : 0, { duration: 220 });
  }, [active, visible]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: visible.value
  }));

  const drops = useMemo<Drop[]>(() => {
    const safeWidth = Math.max(width, 320);
    const safeHeight = Math.max(height, 640);
    return Array.from({ length: intensity }).map((_, i) => {
      const w = 1 + Math.random() * 1.6;
      const h = 14 + Math.random() * 26;
      const left = Math.random() * safeWidth;
      const top = -Math.random() * safeHeight;
      const duration = 900 + Math.random() * 1000;
      const delay = Math.random() * 1200;
      const opacity = 0.14 + Math.random() * 0.22;
      return {
        id: `drop-${i}-${Math.random().toString(16).slice(2)}`,
        left,
        top,
        height: h,
        width: w,
        duration,
        delay,
        opacity
      };
    });
  }, [height, intensity, width]);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, wrapStyle]}>
      {drops.map((drop) => (
        <RainDrop key={drop.id} drop={drop} height={height} />
      ))}
    </Animated.View>
  );
}

function RainDrop({ drop, height }: { drop: Drop; height: number }) {
  const y = useSharedValue(drop.top);

  useEffect(() => {
    y.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(height + 80, {
          duration: drop.duration,
          easing: Easing.linear
        }),
        -1,
        false
      )
    );
  }, [drop.duration, height, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: drop.opacity
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.drop,
        style,
        {
          left: drop.left,
          top: 0,
          width: drop.width,
          height: drop.height
        }
      ]}
    />
  );
}

export function AppBackground({ children }: Props) {
  const weather = useMindFlowStore((s) => s.weather);
  const drift = useSharedValue(0);
  const { width } = useWindowDimensions();
  const intensity = width < 640 ? 22 : 34;

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [drift]);

  const gradientStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (drift.value - 0.5) * 40 },
      { translateY: (0.5 - drift.value) * 28 },
      { scale: 1.1 }
    ],
    opacity: 0.98
  }));

  return (
    <View style={styles.root}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, gradientStyle]}>
        <LinearGradient
          colors={["#6a715f", "#606755", "#505748", "#5a6150"]}
          locations={[0, 0.4, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <AmbientFloatLayer />
      <RainLayer intensity={intensity} active={weather.kind === "rain"} />
      {children}
    </View>
  );
}

function AmbientFloatLayer() {
  const { width, height } = useWindowDimensions();
  const blobs = useMemo(() => {
    const safeWidth = Math.max(width, 320);
    const safeHeight = Math.max(height, 640);
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `blob-${i}-${Math.random().toString(16).slice(2)}`,
      size: 160 + Math.random() * 220,
      left: Math.random() * safeWidth - 120,
      top: Math.random() * safeHeight - 160,
      opacity: 0.06 + Math.random() * 0.06,
      duration: 14000 + Math.random() * 10000
    }));
  }, [height, width]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {blobs.map((b) => (
        <AmbientBlob key={b.id} {...b} />
      ))}
    </View>
  );
}

function AmbientBlob({
  size,
  left,
  top,
  opacity,
  duration
}: {
  size: number;
  left: number;
  top: number;
  opacity: number;
  duration: number;
}) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [duration, p]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: (p.value - 0.5) * 46 },
      { translateY: (0.5 - p.value) * 32 },
      { scale: 0.92 + p.value * 0.12 }
    ]
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ambientBlob,
        style,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left,
          top,
          opacity
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: colors.black
  },
  drop: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(240, 241, 237, 0.95)"
  },
  ambientBlob: {
    position: "absolute",
    backgroundColor: "rgba(240, 241, 237, 1)"
  }
});
