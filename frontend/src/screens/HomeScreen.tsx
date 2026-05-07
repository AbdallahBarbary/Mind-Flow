import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FadeInView } from "../components/FadeInView";
import { BottomNav } from "../components/BottomNav";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { ScreenShell } from "../components/ScreenShell";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, spacing } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 900;
  const desktopCardWidth = Math.max(210, Math.min(360, (width - 80) / 3));

  const days = [
    { day: "23", label: "Sun" },
    { day: "24", label: "Mon" },
    { day: "25", label: "Tue" },
    { day: "26", label: "Wed" },
    { day: "27", label: "Thu" }
  ];

  const [selectedDay, setSelectedDay] = useState("25");
  const tasksByDay: Record<string, { time: string; title: string; priority: string; tone: string }[]> = {
    "23": [
      { time: "Now", title: "Capture\nbrain dump", priority: "High", tone: "#f26b34" },
      { time: "Later", title: "Write\nnote\nsummary", priority: "Normal", tone: "#66715d" }
    ],
    "24": [
      { time: "Now", title: "Start\nfocus\nsession", priority: "Medium", tone: "#d19627" },
      { time: "Later", title: "Review\nweekly\nstats", priority: "Normal", tone: "#66715d" }
    ],
    "25": [
      { time: "Now", title: "Capture\nbrain dump", priority: "High", tone: "#f26b34" },
      { time: "Next", title: "Start\nfocus\nsession", priority: "Medium", tone: "#d19627" },
      { time: "Later", title: "Review\nweekly\nstats", priority: "Normal", tone: "#66715d" }
    ],
    "26": [
      { time: "Now", title: "Clean up\nolder\nnotes", priority: "Medium", tone: "#d19627" },
      { time: "Next", title: "Start\nfocus\nsession", priority: "High", tone: "#f26b34" }
    ],
    "27": [
      { time: "Now", title: "Read\ninsights\nsummary", priority: "Normal", tone: "#66715d" },
      { time: "Later", title: "Plan\nnext\nsessions", priority: "Medium", tone: "#d19627" }
    ]
  };
  const tasks = useMemo(() => tasksByDay[selectedDay] ?? tasksByDay["25"], [selectedDay]);

  const inventory = [
    { title: "Open Brain Dump notes", subtitle: "Quick capture and autosave" },
    { title: "Track focus sessions", subtitle: "Timer, streak, and progress" }
  ];

  return (
    <ScreenShell>
      <FadeInView style={styles.weatherRow}>
        <View>
          <Text style={[styles.weatherMain, isMobile && styles.weatherMainMobile]}>23°</Text>
          <Text style={[styles.weatherSub, isMobile && styles.weatherSubMobile]}>70% chance of rain</Text>
        </View>
        <AnimatedPressable onPress={() => navigation.navigate("Settings")} style={styles.profileButton}>
          <Text style={styles.profileIcon}>◌</Text>
        </AnimatedPressable>
      </FadeInView>

      <FadeInView delay={80}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {days.map((item) => (
            <AnimatedPressable
              key={item.day}
              style={[styles.dayChip, selectedDay === item.day && styles.activeDayChip]}
              onPress={() => setSelectedDay(item.day)}
            >
              {tasksByDay[item.day]?.length ? (
                <Text style={styles.badge}>{tasksByDay[item.day].length}</Text>
              ) : null}
              <Text style={[styles.dayText, isMobile && styles.dayTextMobile, selectedDay === item.day && styles.activeDayText]}>
                {item.day}
              </Text>
              <Text style={[styles.dayLabel, isMobile && styles.dayLabelMobile, selectedDay === item.day && styles.activeDayLabel]}>
                {item.label}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </FadeInView>

      <FadeInView delay={120} style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Daily flow</Text>
        <AnimatedPressable style={styles.addTaskButton} onPress={() => navigation.navigate("Notes")}>
          <Text style={[styles.addTaskText, isMobile && styles.addTaskTextMobile]}>Open notes</Text>
        </AnimatedPressable>
      </FadeInView>

      <FadeInView delay={180}>
        <ScrollView
          horizontal={!isDesktop}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tasksRow, isDesktop && styles.tasksRowDesktop]}
        >
          {tasks.map((task) => (
            <AnimatedPressable
              key={task.title}
              style={[styles.taskCard, isMobile && styles.taskCardMobile, isDesktop && { width: desktopCardWidth }]}
              onPress={() => navigation.navigate(task.title.includes("focus") ? "Focus" : "Notes")}
            >
              <Text style={[styles.taskTime, isMobile && styles.taskTimeMobile]}>{task.time}</Text>
              <Text style={[styles.taskTitle, isMobile && styles.taskTitleMobile]}>{task.title}</Text>
              <Text style={[styles.priorityLabel, isMobile && styles.priorityLabelMobile]}>Priority</Text>
              <View style={[styles.priorityPill, { backgroundColor: task.tone }]}>
                <Text style={[styles.priorityText, isMobile && styles.priorityTextMobile]}>{task.priority}</Text>
              </View>
            </AnimatedPressable>
          ))}
        </ScrollView>
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
  addTaskText: {
    color: "#1c221c",
    fontWeight: "600",
    fontSize: 20
  },
  addTaskTextMobile: {
    fontSize: 11
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
