# Learning Match Roadmap

This roadmap keeps the children's matching game moving in small, reviewable phases. Each phase should preserve the existing category, mode, settings, stickers, progress, and accessibility behavior while making the learning loop more useful.

## Phase 1: Stabilize the Core

Status: complete.

- Wire saved settings into gameplay.
- Keep story mode, timed mode, free play, sticker collection, achievements, and progress working across categories.
- Add regression tests for the main menu, settings, story framing, and progress views.
- Verify with the test suite and production build.

## Phase 2: Deepen the Learning Loop

Status: complete.

- Add richer teaching moments after missed attempts so the child gets a clue, not only a retry.
- Track progress by category, difficulty, game mode, and individual item.
- Identify weak spots from repeated misses or extra attempts.
- Add a weak-area practice flow that focuses future rounds on items that need review.
- Show parent/teacher-friendly progress summaries for accuracy, practice needs, and learning coverage.

## Phase 3: Improve Content Quality

Status: in progress.

- Replace emoji-only learning items with consistent child-friendly illustrations.
- Expand each category with more examples and clearer difficulty progression.
- Add voice/audio assets for prompts and correct pronunciations.
- Prepare the content model for localization.

Current implementation notes:

- Item cards use reusable generated SVG illustrations with emoji as a legacy fallback.
- `src/utils/itemContent.ts` centralizes prompts, hints, examples, visual metadata, and the locale hook for future translations.
- Stickers reuse the same item illustrations when a saved sticker can be matched to known content.

## Phase 4: Expand Game Modes

- Turn story mode into chapter-based adventures with meaningful progress between chapters.
- Add a daily challenge with light rewards.
- Add a calm practice mode with no timers, fewer animations, and longer teaching prompts.
- Add teacher lesson flows for selected categories and difficulty bands.

## Phase 5: Parent and Teacher Tools

- Support multiple child profiles.
- Export progress snapshots.
- Show strengths, practice needs, and recent activity.
- Add per-profile reset and archive controls.

## Phase 6: Production Polish

- Move from Create React App to Vite or another maintained frontend build setup.
- Add CI for tests and production builds.
- Add visual regression checks for mobile and desktop layouts.
- Add PWA/offline support.
- Complete accessibility and audio QA.
