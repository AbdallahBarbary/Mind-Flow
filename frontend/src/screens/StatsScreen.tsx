import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { FadeInView } from "../components/FadeInView";
import { MetricCard } from "../components/MetricCard";
import { ScreenShell } from "../components/ScreenShell";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, radius, shadows, spacing, typography } from "../theme/tokens";

function fmtHourRange(startHour: number, hours: number) {
  const end = (startHour + hours) % 24;
  const f = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    return `${hh}${ampm}`;
  };
  return `${f(startHour)}–${f(end)}`;
}

export function StatsScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const stats = useMindFlowStore((state) => state.stats);
  const streak = useMindFlowStore((state) => state.streak);
  const tasks = useMindFlowStore((state) => state.tasks);
  const max = Math.max(...stats.weeklyMinutes, 1);

  const timeInsight = useMemo(() => {
    // Look at last 14 days of completed tasks, bucket by hour.
    const now = Date.now();
    const cutoff = now - 14 * 24 * 60 * 60 * 1000;
    const buckets = Array.from({ length: 24 }).fill(0) as number[];
    for (const t of tasks) {
      if (!t.done || !t.completedAt) continue;
      const ts = new Date(t.completedAt).getTime();
      if (Number.isNaN(ts) || ts < cutoff) continue;
      const h = new Date(ts).getHours();
      buckets[h] += 1;
    }
    const window = 3;
    let bestStart = 0;
    let bestScore = -1;
    for (let start = 0; start < 24; start++) {
      let score = 0;
      for (let i = 0; i < window; i++) score += buckets[(start + i) % 24];
      if (score > bestScore) {
        bestScore = score;
        bestStart = start;
      }
    }
    if (bestScore <= 0) return null;
    return fmtHourRange(bestStart, window);
  }, [tasks]);

  return (
    <ScreenShell>
      <FadeInView>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Seven day flow.</Text>
        <Text style={[styles.body, isMobile && styles.bodyMobile]}>
          A calm readout of rhythm, not a scoreboard.
        </Text>
      </FadeInView>

      <FadeInView delay={100} style={[styles.chart, isMobile && styles.chartMobile]}>
        <Text style={styles.chartLabel}>FOCUS MINUTES</Text>
        <View style={[styles.bars, isMobile && styles.barsMobile]}>
          {stats.weeklyMinutes.map((minutes, index) => (
            <View
              key={`${minutes}-${index}`}
              style={[
                styles.bar,
                {
                  height: 36 + (minutes / max) * 100,
                  backgroundColor: index === stats.weeklyMinutes.length - 2 ? colors.accent : colors.chart
                }
              ]}
            />
          ))}
        </View>
      </FadeInView>

      <FadeInView delay={180} style={[styles.metrics, isMobile && styles.metricsMobile]}>
        <MetricCard value={`${Math.max(streak.days, stats.streakDays)}d`} label="Streak" />
        <MetricCard value={`${Math.round(stats.totalFocusMinutes / Math.max(stats.completedSessions, 1))}m`} label="Average" accent />
      </FadeInView>

      <FadeInView delay={240} style={styles.summary}>
        <Text style={styles.summaryTitle}>Weekly summary</Text>
        <Text style={styles.summaryBody}>
          {stats.completedSessions} completed sessions, {stats.notesCount} notes, and a steadier rhythm than last week.
        </Text>
        {timeInsight ? (
          <Text style={styles.summaryBody}>
            Your consistency is strongest between {timeInsight}.
          </Text>
        ) : null}
      </FadeInView>

      <View style={styles.bottom}>
        <BottomNav active="Stats" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    color: colors.white,
    marginTop: spacing["4xl"]
  },
  titleMobile: {
    fontSize: 44,
    lineHeight: 50,
    marginTop: spacing["2xl"]
  },
  body: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.lg
  },
  bodyMobile: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  chart: {
    marginTop: spacing["3xl"],
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing["2xl"],
    ...shadows.panel
  },
  chartMobile: {
    marginTop: spacing["2xl"],
    borderRadius: radius.xl,
    padding: spacing.xl
  },
  chartLabel: {
    ...typography.caption,
    color: colors.accent
  },
  bars: {
    height: 148,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  barsMobile: {
    height: 120,
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  bar: {
    flex: 1,
    borderRadius: radius.sm
  },
  metrics: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing["2xl"]
  },
  metricsMobile: {
    marginTop: spacing.lg
  },
  summary: {
    marginTop: spacing["2xl"],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  summaryBody: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm
  },
  bottom: {
    marginTop: "auto"
  }
});
