import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { BottomNav } from "../components/BottomNav";
import { FadeInView } from "../components/FadeInView";
import { ScreenShell } from "../components/ScreenShell";
import { useAutosave } from "../hooks/useAutosave";
import { useMindFlowStore } from "../store/useMindFlowStore";
import { colors, radius, shadows, spacing, typography } from "../theme/tokens";

export function BrainDumpScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const notes = useMindFlowStore((state) => state.notes);
  const createNote = useMindFlowStore((state) => state.createNote);
  const latest = useMemo(() => notes[0]?.content ?? "", [notes]);
  const [content, setContent] = useState(latest);
  const [status, setStatus] = useState("Autosaved locally");
  const [showPrevious, setShowPrevious] = useState(false);

  const previousNotes = useMemo(() => {
    const unique: { id: string; content: string; createdAt: string }[] = [];
    const seen = new Set<string>();
    for (const note of notes) {
      if (!note?.id || seen.has(note.id)) continue;
      seen.add(note.id);
      if (!note.content?.trim()) continue;
      unique.push({ id: note.id, content: note.content, createdAt: note.createdAt });
      if (unique.length >= 8) break;
    }
    return unique;
  }, [notes]);

  const save = useCallback(
    async (value: string) => {
      if (!value.trim()) return;
      setStatus("Saving...");
      try {
        await createNote(value);
        setStatus("Autosaved to MindFlow");
      } catch {
        setStatus("Autosaved locally");
      }
    },
    [createNote]
  );

  useAutosave(content, save);

  return (
    <ScreenShell>
      <FadeInView>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Brain dump.</Text>
        <Text style={[styles.body, isMobile && styles.bodyMobile]}>
          Write before you organize. The signal appears after the noise leaves.
        </Text>
      </FadeInView>

      <FadeInView delay={100} style={[styles.editor, isMobile && styles.editorMobile]}>
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Let the noise out first..."
          placeholderTextColor={colors.faint}
          selectionColor={colors.accent}
          style={[styles.input, isMobile && styles.inputMobile]}
        />
        <Text style={styles.status}>{status}</Text>
      </FadeInView>

      <AnimatedPressable style={styles.preview} onPress={() => setContent("Top 3 priorities\n- Focus sprint\n- Notes cleanup\n- Weekly review")}>
        <Text style={styles.previewTitle}>Morning clarity</Text>
        <Text style={styles.previewBody}>Three priorities, one call, one quiet hour.</Text>
      </AnimatedPressable>

      <AnimatedPressable style={styles.prevHeader} onPress={() => setShowPrevious((v) => !v)}>
        <Text style={styles.prevTitle}>Previous notes</Text>
        <Text style={styles.prevAction}>{showPrevious ? "Hide" : "Show"}</Text>
      </AnimatedPressable>

      {showPrevious ? (
        <View style={styles.prevList}>
          {previousNotes.length === 0 ? (
            <Text style={styles.prevEmpty}>No saved notes yet.</Text>
          ) : (
            previousNotes.map((note) => (
              <AnimatedPressable
                key={note.id}
                style={styles.prevRow}
                onPress={() => {
                  setContent(note.content);
                  setStatus("Loaded previous note");
                }}
              >
                <Text style={styles.prevSnippet} numberOfLines={2}>
                  {note.content}
                </Text>
                <Text style={styles.prevMeta}>{new Date(note.createdAt).toLocaleDateString()}</Text>
              </AnimatedPressable>
            ))
          )}
        </View>
      ) : null}

      <View style={styles.bottom}>
        <BottomNav active="Notes" />
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
    maxWidth: 322,
    marginTop: spacing.lg
  },
  bodyMobile: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  editor: {
    minHeight: 250,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(24, 34, 24, 0.6)",
    padding: spacing["2xl"],
    marginTop: spacing["3xl"],
    ...shadows.panel
  },
  editorMobile: {
    marginTop: spacing["2xl"],
    minHeight: 210,
    borderRadius: radius.xl,
    padding: spacing.xl
  },
  input: {
    flex: 1,
    minHeight: 150,
    color: colors.white,
    fontSize: 18,
    lineHeight: 30,
    textAlignVertical: "top",
    padding: 0
  },
  inputMobile: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120
  },
  status: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.lg
  },
  preview: {
    marginTop: spacing["2xl"],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl
  },
  previewTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  previewBody: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm
  },
  prevHeader: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(24, 34, 24, 0.55)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  prevTitle: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  prevAction: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  prevList: {
    marginTop: spacing.md,
    gap: spacing.sm
  },
  prevRow: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(24, 34, 24, 0.45)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  prevSnippet: {
    color: "#eff2ea",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  prevMeta: {
    marginTop: 6,
    color: colors.faint,
    fontSize: 12,
    lineHeight: 16
  },
  prevEmpty: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: spacing.sm
  },
  bottom: {
    marginTop: "auto"
  }
});
