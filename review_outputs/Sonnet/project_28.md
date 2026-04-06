# project_28 review

## Benchmark status
- Completed: no
- Failed step: prompt 5 (simplify project structure) — broke the app and could not recover
- Status summary: `status.md` states `completed: false` and `failed: failed on last task, broke the app there and was unable to fix`. The project appears to have had a working multi-module implementation (services, hooks, context, components, types, utils) that was destroyed during the prompt 5 simplification pass. The final state has all those directories present but completely empty, leaving only three barebones page files — with no authentication logic, no protected routes, and no profile page.

## Inspection log
- projects/28/status.md
- projects/28/src/App.tsx
- projects/28/src/main.tsx
- projects/28/src/pages/LoginPage.tsx
- projects/28/src/pages/Dashboard.tsx
- projects/28/src/pages/SnakeGamePage.tsx
- projects/28/src/index.css
- projects/28/package.json
- projects/28/vite.config.ts
- projects/28/tsconfig.json
- projects/28/README.md
- projects/28/test-auth.js
- projects/28/src/components/ (empty)
- projects/28/src/context/ (empty)
- projects/28/src/hooks/ (empty)
- projects/28/src/services/ (empty)
- projects/28/src/types/ (empty)
- projects/28/src/utils/ (empty)

## Scores
- Task completion: 3/10
- Correctness: 3/10
- Code quality: 4/10
- Architecture / maintainability: 2/10
- Simplicity vs overengineering: 3/10
- Overall project quality: 3/10

## Summary
Project 28 failed catastrophically during prompt 5: the simplification pass appears to have deleted all auth infrastructure (services, hooks, context, components, types, utils), leaving every subdirectory empty. The final state has three thin page files — a login page with no actual authentication, a dashboard with no protection, and a snake game page — none of which are wired together with real auth or route guarding. The README still describes a rich, modular architecture that simply no longer exists in the source. The `test-auth.js` file attempts to `require` a `authService` that was deleted.

## Strengths
- Snake game (`SnakeGamePage.tsx`) is functionally the most complete piece: grid-based CSS rendering, collision detection (walls and self), score tracking, pause/resume, start button, keyboard controls, and a rules section — satisfies prompt 4 requirements adequately
- Snake game uses a `ref`-based game loop (timeout + refs for snake/dir state) which avoids stale-closure issues in the tick function
- Dark theme with consistent inline styles and global CSS reset is visually coherent
- Login page has email/password fields with a working submit handler
- Minimal `package.json` with only the necessary runtime dependencies

## Weaknesses
- **Critical: All auth infrastructure deleted** — `src/components/`, `src/context/`, `src/hooks/`, `src/services/`, `src/types/`, `src/utils/` are all empty directories. Nothing was preserved from earlier prompts
- **No authentication whatsoever**: `LoginPage.tsx` simply calls `navigate('/dashboard')` on form submit — no credential validation, no state, no token
- **No protected routes**: `App.tsx` routes `/dashboard` directly to `<Dashboard />` with no auth check — any unauthenticated user can visit it freely
- **No profile page (prompt 3 completely absent)**: There is no `ProfilePage` or any profile editing functionality in the codebase
- **No auth refactoring (prompt 2 missing)**: The service/hook/context architecture described in the README was deleted; no modular auth code survives
- **`test-auth.js` is broken**: It attempts to `require('./src/services/authService')` which no longer exists — would throw immediately
- **README is misleading**: Describes a full modular architecture with `authService.ts`, `useAuth.ts`, `AuthContext.tsx`, `ProtectedRoute.tsx`, `testUtils.ts` — none of these files exist in the final state
- **Snake game has a bug**: `food` position is set with `useState({ x: 10, y: 10 })` and never changes — eating food grows the snake and increments score but the food never respawns at a new location, making the game unwinnable after the first food is consumed
- **Dashboard has no user information**: It displays static text with no reference to a logged-in user; there is no logout button or session management
- **Duplicate food-eating check in snake**: The code has two consecutive `if (head.x === food.x && head.y === food.y)` blocks — one sets score, one grows the snake — rather than combining them; minor but sloppy
- **Self-collision check is slightly incorrect**: `snakeRef.current.some((s, i) => i < snakeRef.current.length - 1 && s.x === head.x && s.y === head.y)` — comparing all segments except the last (tail) against the new head is correct in intent, but the indexing logic checks `i < length - 1` which means it checks all segments except the tail, which is the right approach; however, a simpler `slice(0, -1)` would be clearer

## Final verdict
Overall score: 25/100
Project 28 self-reports failure on prompt 5, and the source code confirms the worst possible failure mode: the simplification pass deleted all working auth infrastructure instead of streamlining it, leaving an app with fake navigation, no authentication, no route protection, no profile page, and empty module directories. Three of the five prompts (auth refactor, profile page, and any working auth at all) are completely undelivered in the final state. The only partially salvageable piece is the snake game, which works but has a critical bug where food never respawns. The README and `test-auth.js` are artifacts of a prior, better state that no longer exists.
