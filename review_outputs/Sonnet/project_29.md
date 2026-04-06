# project_29 review

## Benchmark status
- Completed: yes
- Failed step: null
- Status summary: `status.md` reports full completion of all 5 benchmark prompts. Source inspection confirms all four pages are present (login, dashboard, profile, snake game), auth context is implemented, protected routes work, profile editing exists, and the snake game is publicly accessible with rules and controls. The structure is lean — no extra folders, only `context/` and `pages/` under `src/`.

## Inspection log
- projects/29/status.md
- projects/29/my-app/src/App.tsx
- projects/29/my-app/src/index.tsx
- projects/29/my-app/src/index.css
- projects/29/my-app/src/context/AuthContext.tsx
- projects/29/my-app/src/pages/LoginPage.tsx
- projects/29/my-app/src/pages/DashboardPage.tsx
- projects/29/my-app/src/pages/ProfilePage.tsx
- projects/29/my-app/src/pages/SnakeGame.tsx
- projects/29/my-app/src/App.test.tsx
- projects/29/my-app/package.json
- projects/29/my-app/tsconfig.json

## Scores
- Task completion: 8/10
- Correctness: 6/10
- Code quality: 7/10
- Architecture / maintainability: 7/10
- Simplicity vs overengineering: 8/10
- Overall project quality: 7/10

## Summary
Project 29 is a complete, working benchmark submission built on Create React App + TypeScript. All five prompts are addressed: a login page with fake auth and route protection, a modular auth context (with the service logic inlined), an editable profile page, a public snake game with rules and controls, and a simplified flat structure. The code is clean and readable. However, the auth modularisation for prompt 2 is minimal (the service is co-located in `AuthContext.tsx` as a plain object rather than a separate file), the profile update uses a workaround (`login()` re-call) rather than a proper `updateUser` method, the snake game starts immediately without a "start" button and has a stale-closure direction bug, and the boilerplate test file is never updated and would fail.

## Strengths
- **All 5 prompts delivered**: login, dashboard, protected routes, profile editing, snake game (public), simplified structure all present
- **Structure is genuinely simplified (prompt 5)**: only `context/` and `pages/` under `src/` — `ProtectedRoute` is inlined in `App.tsx` with a comment noting this was done for simplicity, which is an honest and clean solution
- **Protected routes are correct**: `ProtectedRoute` reads `user` and `isLoading` from context; unauthenticated users are redirected to `/login`; the login page captures `location.state.from` and redirects back after login
- **Snake game is functionally solid**: CSS grid rendering, wall collision, self-collision, food respawn on eat, score tracking, game-over overlay with restart, and a proper rules & controls section — satisfies prompt 4
- **Snake game accessible to unauthenticated users**: `/snake` route is correctly placed outside `ProtectedRoute`
- **`AuthProvider` uses `useMemo`** to avoid unnecessary context re-renders — good React practice
- **Auth state initialised synchronously from localStorage** (`useState(authService.getCurrentUser())`), avoiding a flash of the loading state on page reload
- **Login page properly redirects back to `from`** after authentication, preserving navigation intent
- **Dashboard shows user name and initial avatar**, making it feel like a real app
- **No debug console.logs** and no unnecessary complexity

## Weaknesses
- **Prompt 2 (auth modularity) is shallow**: the `authService` object is defined directly inside `AuthContext.tsx` rather than in a separate file (e.g. `services/authService.ts`). It is not importable or testable independently. The refactor added structure in concept but not in practice
- **Profile update uses a hacky re-login workaround**: `handleSave` manually saves to `localStorage` then calls `await login(formData.email)` — this re-runs the 1-second simulated delay, overwrites the name with `email.split('@')[0]` derived from the new email (losing the manually entered `name`), and is not a clean `updateUser` method. If the user changes their name to "Alice" and email to "bob@example.com", the displayed name becomes "bob" after save, not "Alice"
- **Snake game starts immediately on mount** (the `setInterval` fires right away) — there is no "Start" button. The snake begins moving as soon as the page loads, which is poor UX and makes it impossible to read the rules before the game begins
- **Snake game has a stale-closure direction bug**: `moveSnake` captures `direction` in its closure and is used inside `setInterval`. Although `moveSnake` is recreated via `useCallback` when `direction` changes (which resets the interval via the `useEffect` dependency), rapid key presses within a single 150ms frame can cause direction to be read from stale state, potentially allowing a 180° reversal. The direction reversal guard (`if (direction.y === 0)`) is correct in logic but reads from the state at the time of key event, not the direction at the time of the next tick, making double-reverse still possible on fast input
- **Boilerplate test file never updated**: `App.test.tsx` still queries for "learn react" text — would fail immediately if run
- **`lucide-react` version `^1.7.0`** in `package.json` — this appears to be a non-existent or very unusual version (lucide-react versions are typically `0.x.x` or `0.4xx.x`); may cause install failure
- **No `updateProfile` method on auth context**: the profile page bypasses the context entirely by writing directly to `localStorage` and calling `login()`, which is an abstraction violation — the context should own all auth state mutations
- **`useMemo` for context value omits `login` and `logout` from the dependency array** — both are defined inline in the component (not wrapped in `useCallback`), so they are recreated every render anyway, making the `useMemo` partially ineffective for preventing re-renders
- **`SnakeGame` renders without a navigate-back button or link to login/dashboard** — a user landing on `/snake` has no obvious way to get to the login page

## Final verdict
Overall score: 66/100
Project 29 completes all five benchmark prompts and is a clean, readable, well-structured submission. The simplified architecture (prompt 5) is honestly implemented, the snake game works, protected routes are correct, and the overall code quality is good. However, several correctness issues hold it back: the profile save silently overwrites the user's name with a derived value (breaking the core profile-edit feature), the snake game starts without user interaction, the auth service was never actually extracted to its own module (making prompt 2 superficial), and the boilerplate test would fail. These are not cosmetic issues — the profile editing bug in particular makes a required feature functionally broken.
