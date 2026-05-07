import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { FadeInView } from "../components/FadeInView";
import { ScreenShell } from "../components/ScreenShell";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, radius, spacing, typography } from "../theme/tokens";
import { AnimatedPressable } from "../components/AnimatedPressable";

function toDayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function startOfMonth(d: Date) {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  next.setDate(1);
  return next;
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(d.getDate() + days);
  return next;
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hh = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function CalendarScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const tasks = useMindFlowStore((s) => s.tasks);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDayKey, setSelectedDayKey] = useState(() => toDayKey(new Date()));

  const daysInMonth = useMemo(() => {
    const first = startOfMonth(month);
    const end = new Date(first);
    end.setMonth(first.getMonth() + 1);
    end.setDate(0);
    const count = end.getDate();
    return Array.from({ length: count }).map((_, i) => addDays(first, i));
  }, [month]);

  const countByDayKey = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const t of tasks) {
      const prev = map.get(t.dayKey) ?? { total: 0, done: 0 };
      prev.total += 1;
      if (t.done) prev.done += 1;
      map.set(t.dayKey, prev);
    }
    return map;
  }, [tasks]);

  const timeline = useMemo(() => {
    const forDay = tasks.filter((t) => t.dayKey === selectedDayKey);
    const ordered = [...forDay].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    // Auto-place blocks to give the same *feel* as the reference timeline, even without explicit times.
    let cursor = 7 * 60; // 7:00 AM
    return ordered.map((t, idx) => {
      const duration = 30 + ((idx * 10) % 3) * 15; // 30/45/60
      const start = cursor;
      cursor += duration + 15;
      return {
        id: t.id,
        title: t.title,
        done: t.done,
        start,
        duration
      };
    });
  }, [selectedDayKey, tasks]);

  const hours = useMemo(() => Array.from({ length: 11 }).map((_, i) => 7 * 60 + i * 60), []);

  return (
    <ScreenShell>
      <FadeInView>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, isMobile && styles.titleMobile]}>Calendar.</Text>
            <Text style={[styles.sub, isMobile && styles.subMobile]}>{monthLabel(month)}</Text>
          </View>
          <View style={styles.monthActions}>
            <AnimatedPressable
              style={styles.monthButton}
              onPress={() => {
                const d = new Date(month);
                d.setMonth(month.getMonth() - 1);
                setMonth(startOfMonth(d));
              }}
            >
              <Text style={styles.monthButtonText}>←</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={styles.monthButton}
              onPress={() => {
                const d = new Date(month);
                d.setMonth(month.getMonth() + 1);
                setMonth(startOfMonth(d));
              }}
            >
              <Text style={styles.monthButtonText}>→</Text>
            </AnimatedPressable>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={90}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayStrip}
        >
          {daysInMonth.map((d) => {
            const key = toDayKey(d);
            const counts = countByDayKey.get(key);
            const isSelected = key === selectedDayKey;
            const isToday = key === toDayKey(new Date());
            const progress = counts && counts.total > 0 ? counts.done / counts.total : 0;
            return (
              <AnimatedPressable
                key={key}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => setSelectedDayKey(key)}
              >
                <Text style={[styles.dayPillDow, isSelected && styles.dayPillDowSelected]}>
                  {d.toLocaleString(undefined, { weekday: "short" }).slice(0, 3)}
                </Text>
                <Text style={[styles.dayPillNum, isSelected && styles.dayPillNumSelected]}>
                  {d.getDate()}
                </Text>
                <View style={[styles.dayPillTrack, isSelected && styles.dayPillTrackSelected]}>
                  <View style={[styles.dayPillFill, { width: `${Math.round(progress * 100)}%` }]} />
                </View>
                {isToday ? <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} /> : null}
              </AnimatedPressable>
            );
          })}
        </ScrollView>
      </FadeInView>

      <FadeInView delay={160} style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>
            {new Date(selectedDayKey).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </Text>
          <Text style={styles.timelineMeta}>{timeline.length ? `${timeline.length} blocks` : "No blocks yet"}</Text>
        </View>

        <View style={styles.timelineBody}>
          <View style={styles.timeCol}>
            {hours.map((m) => (
              <View key={m} style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(m).replace(":00", "")}</Text>
              </View>
            ))}
          </View>

          <View style={styles.track}>
            <View style={styles.trackLine} />
            {timeline.length === 0 ? (
              <Text style={styles.timelineEmpty}>Add tasks from Home, then see them land here.</Text>
            ) : (
              timeline.map((b) => {
                const top = ((b.start - 7 * 60) / 60) * 64;
                const height = (b.duration / 60) * 64;
                return (
                  <View
                    key={b.id}
                    style={[
                      styles.block,
                      {
                        top,
                        height,
                        backgroundColor: b.done ? "rgba(240,241,237,0.18)" : "rgba(240,241,237,0.32)",
                        borderColor: b.done ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.26)"
                      }
                    ]}
                  >
                    <Text style={[styles.blockTitle, b.done && styles.blockTitleDone]} numberOfLines={2}>
                      {b.title}
                    </Text>
                    <Text style={styles.blockMeta}>{b.done ? "Done" : `${formatTime(b.start)} · ${b.duration}m`}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </FadeInView>

      <View style={styles.bottom}>
        <BottomNav active="Calendar" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: spacing["4xl"]
  },
  title: {
    ...typography.display,
    color: colors.white
  },
  titleMobile: {
    fontSize: 44,
    lineHeight: 50
  },
  sub: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm
  },
  subMobile: {
    fontSize: 14,
    lineHeight: 20
  },
  monthActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  monthButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(25, 34, 25, 0.65)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  monthButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800"
  },
  dayStrip: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm
  },
  dayPill: {
    width: 68,
    height: 88,
    borderRadius: radius.lg,
    backgroundColor: "rgba(22, 28, 22, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between"
  },
  dayPillSelected: {
    backgroundColor: "#f0f1ed",
    borderColor: "rgba(255,255,255,0.5)"
  },
  dayPillDow: {
    color: "rgba(240,241,237,0.72)",
    fontSize: 11,
    fontWeight: "800"
  },
  dayPillDowSelected: {
    color: "#2c322c"
  },
  dayPillNum: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  dayPillNumSelected: {
    color: "#1f251f"
  },
  dayPillTrack: {
    width: "70%",
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(240,241,237,0.16)"
  },
  dayPillTrackSelected: {
    backgroundColor: "rgba(31,37,31,0.12)"
  },
  dayPillFill: {
    height: "100%",
    backgroundColor: "rgba(240,241,237,0.85)"
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(240,241,237,0.8)"
  },
  todayDotSelected: {
    backgroundColor: "rgba(31,37,31,0.55)"
  },
  timelineCard: {
    marginTop: spacing.sm,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(24, 34, 24, 0.55)",
    padding: spacing.xl,
    minHeight: 380
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  timelineTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900"
  },
  timelineMeta: {
    color: "rgba(240,241,237,0.65)",
    fontSize: 12,
    fontWeight: "800"
  },
  timelineBody: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.md
  },
  timeCol: {
    width: 70
  },
  timeRow: {
    height: 64,
    justifyContent: "flex-start"
  },
  timeText: {
    color: "rgba(240,241,237,0.6)",
    fontSize: 11,
    fontWeight: "800"
  },
  track: {
    flex: 1,
    minHeight: 64 * 11,
    position: "relative"
  },
  trackLine: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 2,
    backgroundColor: "rgba(240,241,237,0.10)"
  },
  timelineEmpty: {
    marginTop: spacing.md,
    marginLeft: 26,
    color: "rgba(240,241,237,0.68)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  block: {
    position: "absolute",
    left: 26,
    right: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "space-between"
  },
  blockTitle: {
    color: "#eff2ea",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  blockTitleDone: {
    color: "rgba(239,242,234,0.62)"
  },
  blockMeta: {
    marginTop: 6,
    color: "rgba(240,241,237,0.65)",
    fontSize: 11,
    fontWeight: "800"
  },
  bottom: {
    marginTop: "auto"
  }
});

