# project_4 review

## Benchmark status
- Completed: yes (self-reported)
- Failed step: null (self-reported)
- Status summary: `status.md` reports `completed: true`, `failed: null`. Source inspection reveals meaningful gaps: profile editing does not persist to auth state (explicitly acknowledged in code comments), the Snake game rules/controls section is minimal and incomplete, and there is a double-`AuthProvider` structural bug. The project delivers most features but with notable implementation shortfalls.

---

## Inspection log
- `prompts/prompt1.md`
- `prompts/prompt2.md`
- `prompts/prompt3.md`
- `prompts/prompt4.md`
- `prompts/prompt5.md`
- `projects/4/status.md`
- `projects/4/package.json`
- `projects/4/tsconfig.json`
- `projects/4/README.md`
- `projects/4/src/index.tsx`
- `projects/4/src/App.tsx`
- `projects/4/src/App.css`
- `projects/4/src/index.css`
- `projects/4/src/context/AuthContext.tsx`
- `projects/4/src/services/authService.ts`
- `projects/4/src/types/auth.ts`
- `projects/4/src/components/ProtectedRoute.tsx`
- `projects/4/src/pages/Login.tsx`
- `projects/4/src/pages/Dashboard.tsx`
- `projects/4/src/pages/Profile.tsx`
- `projects/4/src/pages/SnakeGame.tsx`

---

## Scores

- Task completion: 5/10
- Correctness: 5/10
- Code quality: 6/10
- Architecture / maintainability: 5/10
- Simplicity vs overengineering: 6/10
- Overall project quality: 5/10

---

## Summary

Project 4 is a Create React App–based project that covers all five benchmark prompts at a surface level, but has meaningful correctness gaps throughout. Auth is modularized into a service class, profile editing exists but explicitly does not persist (the code comment even admits it), the Snake game has minimal on-page rules/controls, and `AuthProvider` is accidentally rendered twice in a nested configuration. The overall quality is functional enough to demo but contains several bugs and incomplete implementations that undermine the benchmark goals.

---

## Strengths

- **Prompt 1**: Login page, Dashboard, fake auth (accepts any email+password), `ProtectedRoute`, and React Router routing are all present and functional. Session persistence via localStorage works on page reload.
- **Prompt 2**: An `AuthService` class is properly extracted to `services/authService.ts` with `login`, `logout`, and `getCurrentUser` methods. `AuthContext` delegates to it, creating a clear separation between storage and state management. `User` type is cleanly separated in `types/auth.ts`.
- **Prompt 3**: `Profile.tsx` exists with name and email input fields, a loading state during save, and a success message — the UI structure is correct.
- **Prompt 4**: `SnakeGame.tsx` is at `/snakegame` (publicly accessible, no auth guard). SVG-based rendering is clean and human-readable — snake body segments as `<rect>` elements, food as a `<circle>`, subtle grid lines. Wall collision, self-collision, food eating, and score tracking all work correctly. The game loop is simple and readable.
- **Prompt 5**: Source structure is clean and minimal — `pages/`, `context/`, `components/`, `services/`, `types/` — each with one file. No over-abstraction.
- `ProtectedRoute` correctly stores the attempted location for post-login redirect.

---

## Weaknesses

- **Prompt 3 — Profile save does not update auth state**: The `handleSave` in `Profile.tsx` simulates a delay and shows a success toast, but the data is **not saved anywhere** — not to localStorage, not to the auth context. The code contains an explicit comment: *"Note: To actually update the context, you would need to add an updateUser method to the auth service."* `AuthContext` has no `updateUser` method. This is a self-acknowledged incomplete implementation — the benchmark requires a functionally editable profile.

- **Prompt 4 — Rules and controls section is incomplete**: The snake game only shows the line *"Use arrow keys to move the snake. Eat the red food to grow."* as an inline paragraph, and only when the game is *not* over (when it is over, this text disappears). The prompt explicitly requires "rules and controls for the game written in this page." There is no dedicated controls section, no mention of pause, no WASD support, and the hint disappears mid-game.

- **Double `AuthProvider` bug**: `AuthProvider` is mounted in both `index.tsx` (wrapping `<App>`) and inside `App.tsx` itself (wrapping `<BrowserRouter>`). This creates a nested provider situation where the inner provider shadows the outer one. `useAuth()` inside `App` reads from the outer provider, but all page components render inside the inner provider — a separate context state instance. Login calls `login()` from the inner context, updating the inner state, but `App`'s root-level `user` reference comes from the *outer* context and never updates. The `Navigate` redirect at the `/` route consequently never redirects to `/dashboard` after login — it always reads `null` from the outer context.

- **`AuthContext.login()` takes a pre-built `User` object**: The context's `login` function accepts a `User` parameter supplied entirely by the caller. `Login.tsx` hardcodes `{ id: '1', name: 'Fake User', email }` — the password is never validated. This means `authService` has no authentication logic at all; it only persists whatever the caller provides. The service is a thin localStorage wrapper, not a real auth service.

- **CRA with React 19**: The project uses `react-scripts 5.0.1` (Create React App) alongside `react: ^19.2.4`. CRA is officially unmaintained and has known incompatibilities with React 18+. This combination may cause build or runtime warnings.

- **No WASD support**: Snake game only supports arrow keys, which is a minor gap relative to similar projects.

- **`direction` used by value in interval closure**: The game interval captures `direction` from the outer scope. Since `direction` is in the `useEffect` dependency array, the interval is torn down and recreated on every direction change — functional but slightly wasteful compared to using a ref.

- **Dashboard is minimal**: The Dashboard page shows only the user's name and a logout button — no navigation to Profile, no user details card, no link to the Snake game. Minimal but not wrong per the prompt.

---

## Final verdict

Overall score: 32/100 *(sum of individual scores)*

Project 4 has the right structural bones — service/context/pages separation, protected routes, all required pages present — but two of the five benchmark prompts have meaningful implementation failures: profile editing silently discards all changes (and the code admits this), and the Snake game's rules/controls are a single disappearing sentence rather than a proper on-page section. Compounding this, the double-`AuthProvider` bug means the root-level redirect logic in `App.tsx` is broken. The submission is functional enough for a demo but incomplete as a benchmark deliverable.
