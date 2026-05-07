import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBackground } from "./AppBackground";
import { spacing } from "../theme/tokens";

type Props = {
  children: ReactNode;
};

export function ScreenShell({ children }: Props) {
  const { width } = useWindowDimensions();
  const horizontal = width < 640 ? spacing.md : spacing.lg;
  const maxWidth = width > 1280 ? 1100 : width > 900 ? 920 : 700;

  return (
    <AppBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontal, paddingTop: spacing.lg, paddingBottom: 0 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { maxWidth }]}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    width: "100%",
    alignSelf: "center"
  }
});
