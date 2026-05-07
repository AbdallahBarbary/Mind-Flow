# MindFlow Motion System

## Motion Principles

- Slow enough to feel intentional.
- Fast enough to avoid friction.
- Use motion as guidance, not decoration.
- Avoid bounce, elastic overshoot, and noisy loops.

## Timing

- Screen transition: 620ms to 760ms.
- Button press: 160ms to 200ms.
- Modal entry: 480ms to 540ms.
- Word reveal: 84ms stagger per word.
- Autosave state fade: 240ms.

## Required Patterns

### Word-by-word text reveal

Headings reveal word by word using opacity, vertical translation, and blur.

### Fade transitions

Secondary panels and analytics cards fade in after primary content.

### Blur transitions

Modal and focus completion states use backdrop blur with a small scale lift.

### Scale micro-interactions

Primary buttons scale to `0.97` on press and restore to `1` with a short timing curve.

### Gesture transitions

Timer gestures use high damping springs. The user should feel guided, never gamified.

## Implementation

The Expo app stores reusable motion values in `frontend/src/animations/motion.ts`.
