import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../theme/tokens";
import { RootStackParamList } from "../navigation/types";
import { AnimatedPressable } from "./AnimatedPressable";

type RouteName = "Home" | "Notes" | "Focus" | "Stats";

const items: { label: string; route: RouteName; icon: string }[] = [
  { label: "Home", route: "Home", icon: "◉" },
  { label: "Notes", route: "Notes", icon: "◎" },
  { label: "Focus", route: "Focus", icon: "◌" },
  { label: "Stats", route: "Stats", icon: "◈" }
];

type Props = {
  active: RouteName;
};

export function BottomNav({ active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom }]}>
      {items.map((item) => {
        const isActive = item.route === active;
        return (
          <AnimatedPressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            style={[styles.item, isActive && styles.activeItem]}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>{item.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    minHeight: 70,
    borderRadius: radius.xl,
    borderWidth: 0,
    backgroundColor: "rgba(28, 35, 28, 0.9)",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 0
  },
  item: {
    flex: 1,
    minWidth: 72,
    height: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 6
  },
  activeItem: {
    backgroundColor: "#f0f1ed"
  },
  icon: {
    color: colors.faint,
    fontSize: 15,
    lineHeight: 16
  },
  activeIcon: {
    color: "#1e241e"
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600"
  },
  activeLabel: {
    color: "#1e241e"
  }
});
