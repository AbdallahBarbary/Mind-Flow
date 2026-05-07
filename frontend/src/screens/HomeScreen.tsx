import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FadeInView } from "../components/FadeInView";
import { BottomNav } from "../components/BottomNav";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, spacing } from "../theme/tokens";
import { useMindFlowStore } from "../store/useMindFlowStore";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 900;
  const desktopCardWidth = Math.max(210, Math.min(360, (width - 80) / 3));

  const storeTasks = useMindFlowStore((s) => s.tasks);
  const addTask = useMindFlowStore((s) => s.addTask);
  const toggleTask = useMindFlowStore((s) => s.toggleTask);
  const clearCompletedTasks = useMindFlowStore((s) => s.clearCompletedTasks);
  const weather = useMindFlowStore((s) => s.weather);
  const setWeather = useMindFlowStore((s) => s.setWeather);
  const refreshWeather = useMindFlowStore((s) => s.refreshWeather);

  const days = useMemo(() => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { key, day: String(d.getDate()), label: labels[d.getDay()] };
    });
  }, []);

  const [selectedDayKey, setSelectedDayKey] = useState(days[0]?.key ?? "");
  const [draftTask, setDraftTask] = useState("");
  const tasksForDay = useMemo(
    () => storeTasks.filter((t) => t.dayKey === selectedDayKey),
    [selectedDayKey, storeTasks]
  );
  const badgeByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of storeTasks) {
      if (t.done) continue;
      map.set(t.dayKey, (map.get(t.dayKey) ?? 0) + 1);
    }
    return map;
  }, [storeTasks]);
  const inventory = [
    { title: "Open Brain Dump notes", subtitle: "Quick capture and autosave" },
    { title: "Track focus sessions", subtitle: "Timer, streak, and progress" }
  ];

  return (
    <ScreenShell>
      <FadeInView style={styles.weatherRow}>
        <View>
          <Text style={[styles.weatherMain, isMobile && styles.weatherMainMobile]}>
            {typeof weather.tempC === "number" ? `${Math.round(weather.tempC)}°` : "—"}
          </Text>
          <Text style={[styles.weatherSub, isMobile && styles.weatherSubMobile]}>
            {weather.label ? weather.label : weather.kind === "rain" ? "Rain" : "Clear"}
          </Text>
        </View>
        <View style={styles.weatherActions}>
          <AnimatedPressable
            onPress={() => setWeather(weather.kind === "rain" ? "clear" : "rain")}
            style={styles.weatherToggle}
          >
            <Text style={styles.weatherToggleText}>{weather.kind === "rain" ? "Rain" : "Clear"}</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => void refreshWeather()} style={styles.weatherToggle}>
            <Text style={styles.weatherToggleText}>Auto</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => navigation.navigate("Settings")} style={styles.profileButton}>
            <Text style={styles.profileIcon}>◌</Text>
          </AnimatedPressable>
        </View>
      </FadeInView>

      <FadeInView delay={80}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {days.map((item) => (
            <AnimatedPressable
              key={item.key}
              style={[styles.dayChip, selectedDayKey === item.key && styles.activeDayChip]}
              onPress={() => setSelectedDayKey(item.key)}
            >
              {badgeByKey.get(item.key) ? <Text style={styles.badge}>{badgeByKey.get(item.key)}</Text> : null}
              <Text style={[styles.dayText, isMobile && styles.dayTextMobile, selectedDayKey === item.key && styles.activeDayText]}>
                {item.day}
              </Text>
              <Text style={[styles.dayLabel, isMobile && styles.dayLabelMobile, selectedDayKey === item.key && styles.activeDayLabel]}>
                {item.label}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </FadeInView>

      <FadeInView delay={120} style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Tasks</Text>
        <View style={styles.headerButtons}>
          <AnimatedPressable
            style={[styles.addTaskButton, styles.clearButton]}
            onPress={() => void clearCompletedTasks()}
          >
            <Text style={[styles.addTaskText, isMobile && styles.addTaskTextMobile]}>Clear done</Text>
          </AnimatedPressable>
          <AnimatedPressable style={styles.addTaskButton} onPress={() => navigation.navigate("Notes")}>
            <Text style={[styles.addTaskText, isMobile && styles.addTaskTextMobile]}>Open notes</Text>
          </AnimatedPressable>
        </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={styles.addRow}>
          <TextInput
            value={draftTask}
            onChangeText={setDraftTask}
            placeholder="Add a task…"
            placeholderTextColor="rgba(240,241,237,0.55)"
            style={[styles.input, isMobile && styles.inputMobile]}
            returnKeyType="done"
            onSubmitEditing={() => {
              void addTask(draftTask, selectedDayKey);
              setDraftTask("");
            }}
          />
          <AnimatedPressable
            style={styles.addPill}
            onPress={() => {
              void addTask(draftTask, selectedDayKey);
              setDraftTask("");
            }}
          >
            <Text style={styles.addPillText}>＋</Text>
          </AnimatedPressable>
        </View>

        <Animated.View
          key={selectedDayKey}
          layout={LinearTransition.springify().damping(18).stiffness(220)}
          style={{ width: "100%" }}
        >
          <ScrollView
            horizontal={!isDesktop}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tasksRow, isDesktop && styles.tasksRowDesktop]}
          >
            {tasksForDay.map((task) => (
              <Animated.View
                key={task.id}
                entering={FadeInDown.duration(260)}
                exiting={FadeOutUp.duration(180)}
                layout={LinearTransition.springify().damping(18).stiffness(220)}
              >
                <AnimatedPressable
                  style={[
                    styles.taskCard,
                    isMobile && styles.taskCardMobile,
                    isDesktop && { width: desktopCardWidth },
                    task.done && styles.taskCardDone
                  ]}
                  onPress={() => void toggleTask(task.id)}
                >
                  <Text style={[styles.taskTime, isMobile && styles.taskTimeMobile]}>
                    {task.done ? "Done" : "Tap to finish"}
                  </Text>
                  <Text
                    style={[
                      styles.taskTitle,
                      isMobile && styles.taskTitleMobile,
                      task.done && styles.taskTitleDone
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text style={[styles.priorityLabel, isMobile && styles.priorityLabelMobile]}>
                    {task.done ? "Completed" : "In progress"}
                  </Text>
                  <View style={[styles.priorityPill, { backgroundColor: task.done ? "#66715d" : "#f26b34" }]}>
                    <Text style={[styles.priorityText, isMobile && styles.priorityTextMobile]}>
                      {task.done ? "Done" : "Active"}
                    </Text>
                  </View>
                </AnimatedPressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </FadeInView>

      <FadeInView delay={240}>
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Your tools</Text>
      </FadeInView>
      <FadeInView delay={300} style={styles.inventoryGrid}>
        {inventory.map((item) => (
          <AnimatedPressable
            key={item.title}
            style={[styles.inventoryCard, isMobile && styles.inventoryCardMobile]}
            onPress={() => navigation.navigate(item.title.includes("Focus") ? "Focus" : "Notes")}
          >
            <Text style={[styles.inventoryTitle, isMobile && styles.inventoryTitleMobile]}>{item.title}</Text>
            <Text style={styles.inventorySubtitle}>{item.subtitle}</Text>
          </AnimatedPressable>
        ))}
      </FadeInView>

      <View style={styles.bottom}>
        <BottomNav active="Home" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  weatherRow: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  weatherActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  weatherToggle: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(240, 241, 237, 0.18)",
    borderColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  weatherToggleText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700"
  },
  weatherMain: {
    color: colors.white,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "300"
  },
  weatherMainMobile: {
    fontSize: 26,
    lineHeight: 30
  },
  weatherSub: {
    color: colors.muted,
    fontSize: 22,
    lineHeight: 26,
    marginTop: -2
  },
  weatherSubMobile: {
    fontSize: 14,
    lineHeight: 18
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(25, 34, 25, 0.65)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  profileIcon: {
    color: colors.white,
    fontSize: 18
  },
  daysRow: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg
  },
  dayChip: {
    width: 62,
    height: 74,
    borderRadius: radius.md,
    backgroundColor: "rgba(22, 28, 22, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  activeDayChip: {
    backgroundColor: "#f0f1ed"
  },
  badge: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    lineHeight: 16,
    color: colors.white,
    backgroundColor: "#31382f"
  },
  dayText: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "300"
  },
  dayTextMobile: {
    fontSize: 18,
    lineHeight: 22
  },
  activeDayText: {
    color: "#1f251f"
  },
  dayLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16
  },
  dayLabelMobile: {
    fontSize: 10,
    lineHeight: 12
  },
  activeDayLabel: {
    color: "#2c322c"
  },
  sectionHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center"
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 56,
    lineHeight: 60,
    fontWeight: "700"
  },
  sectionTitleMobile: {
    fontSize: 24,
    lineHeight: 30
  },
  addTaskButton: {
    backgroundColor: "#f0f1ed",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  clearButton: {
    backgroundColor: "rgba(240,241,237,0.78)"
  },
  addTaskText: {
    color: "#1c221c",
    fontWeight: "600",
    fontSize: 20
  },
  addTaskTextMobile: {
    fontSize: 11
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: "rgba(24, 34, 24, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 16,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600"
  },
  inputMobile: {
    height: 44,
    fontSize: 13
  },
  addPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f0f1ed",
    alignItems: "center",
    justifyContent: "center"
  },
  addPillText: {
    color: "#1c221c",
    fontSize: 22,
    fontWeight: "800"
  },
  tasksRow: {
    gap: spacing.md,
    paddingBottom: spacing.md
  },
  tasksRowDesktop: {
    width: "100%"
  },
  taskCard: {
    width: 260,
    minHeight: 230,
    borderRadius: radius.md,
    backgroundColor: "#f2f3ef",
    padding: spacing.lg
  },
  taskCardDone: {
    backgroundColor: "rgba(242, 243, 239, 0.74)"
  },
  taskCardMobile: {
    width: 160,
    minHeight: 150,
    padding: spacing.md
  },
  taskTime: {
    color: "#8f9588",
    fontSize: 24,
    marginBottom: spacing.sm
  },
  taskTimeMobile: {
    fontSize: 11
  },
  taskTitle: {
    color: "#111511",
    fontWeight: "700",
    fontSize: 46,
    lineHeight: 50
  },
  taskTitleDone: {
    color: "rgba(17, 21, 17, 0.5)"
  },
  taskTitleMobile: {
    fontSize: 16,
    lineHeight: 20
  },
  priorityLabel: {
    color: "#8f9588",
    fontSize: 22,
    marginTop: "auto"
  },
  priorityLabelMobile: {
    fontSize: 11
  },
  priorityPill: {
    borderRadius: 18,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 6
  },
  priorityText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600"
  },
  priorityTextMobile: {
    fontSize: 10
  },
  inventoryGrid: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.md
  },
  inventoryCard: {
    flex: 1,
    minHeight: 160,
    borderRadius: radius.md,
    backgroundColor: "rgba(24, 34, 24, 0.65)",
    padding: spacing.lg,
    justifyContent: "space-between"
  },
  inventoryCardMobile: {
    minHeight: 120,
    padding: spacing.md
  },
  inventoryTitle: {
    color: "#eff2ea",
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "600"
  },
  inventoryTitleMobile: {
    fontSize: 14,
    lineHeight: 18
  },
  inventorySubtitle: {
    color: "#99a492",
    fontSize: 16
  },
  bottom: {
    marginTop: "auto"
  }
});
