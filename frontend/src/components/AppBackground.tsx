import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/tokens";

type Props = {
  children: ReactNode;
};

export function AppBackground({ children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#6a715f", "#606755", "#5a6150"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: colors.black
  }
});
