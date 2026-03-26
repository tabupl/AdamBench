# project_19 review

## Benchmark status
- Completed: false
- Failed step: Prompt 4 — Snake game introduced bugs the agent could not fix
- Status summary: `status.md` explicitly marks this as incomplete, citing that prompt 4 introduced bugs into the Snake game implementation that could not be resolved. Prompts 1, 2, and 3 appear fully delivered. Prompt 4 is structurally present but broken due to serious stale-closure bugs in the game loop. Prompt 5 (simplify) was apparently not reached or not applied, as the project retains unnecessary complexity.

## Inspection log
- projects/19/status.md
- projects/19/react-auth-app/package.json
- projects/19/react-auth-app/src/index.tsx
- projects/19/react-auth-app/src/App.tsx
- projects/19/react-auth-app/src/types/index.ts
- projects/19/react-auth-app/src/services/authService.tsx
- projects/19/react-auth-app/src/components/ProtectedRoute.tsx
- projects/19/react-auth-app/src/components/SnakeGame.tsx
- projects/19/react-auth-app/src/pages/LoginPage.tsx
- projects/19/react-auth-app/src/pages/DashboardPage.tsx
- projects/19/react-auth-app/src/pages/ProfilePage.tsx
- projects/19/react-auth-app/src/pages/SignupPage.tsx
- projects/19/react-auth-app/src/pages/SnakeGamePage.tsx
- projects/19/react-auth-app/src/styles/SnakeGame.css
- projects/19/react-auth-app/src/styles/LoginPage.css
- projects/19/react-auth-app/src/utils/ (empty directory)

## Scores
- Task completion: 5/10
- Correctness: 5/10
- Code quality: 6/10
- Architecture / maintainability: 6/10
- Simplicity vs overengineering: 4/10
- Overall project quality: 5/10

## Summary
Project 19 successfully delivers prompts 1–3 (React + TS app with auth, modular auth refactor, editable profile), but fails at prompt 4 due to a broken Snake game that cannot function correctly. The Snake component uses `requestAnimationFrame` with a game loop that captures stale React state — the `snake` array is never updated inside the loop, meaning the snake never actually grows and self-collision checking is broken. Prompt 5 (simplify) was not meaningfully applied, as the project retains over-engineered patterns from prompt 2.

## Strengths
- **Prompts 1–3 are solid**: Login, dashboard, and profile pages all work correctly; authentication is modular and testable; profile editing is fully functional with email validation, success/error feedback, and state persistence.
- **Auth module design** (prompt 2): The `AuthService` class approach cleanly separates storage and fake API logic from the React context. Three separate hooks (`useAuth`, `useAuthState`, `useAuthActions`) allow consumers to subscribe to only what they need — genuinely modular and testable.
- **Protected routes correct**: `ProtectedRoute` correctly uses `useAuthState` and redirects to `/login` on unauthenticated access. `AuthProvider` hydrates from localStorage on mount.
- **Profile page quality**: Edit/view toggle, email format validation, 3-second auto-dismiss success message, and correct state update propagation to the auth context.
- **Snake game rules and controls section**: Even though the game loop is broken, the rules/controls section is clearly written as required by prompt 4.
- **`SnakeGamePage` is publicly accessible**: The route `/snake` is not wrapped by `ProtectedRoute`, meeting prompt 4's accessibility requirement.
- **CSS per page**: Each page has its own scoped CSS file, keeping styles from bleeding across components.

## Weaknesses
- **Snake game is broken — stale closure bug (critical)**: The main game loop `useEffect` has `[gameStatus, nextDirection, speed, score]` as its dependency array, but captures `snake` from the outer scope at the time the effect was last created. Because `snake` is not in the dependency array, the loop always operates on a stale snapshot of the snake array. In practice, `newSnake` is always a copy of the initial one-element snake `[{ x:10, y:10 }]`, meaning the snake never grows, and self-collision is always checked against a stale body. This is a fundamental, game-breaking correctness failure.
- **`generateFood` stale closure**: `generateFood` is a `useCallback` that depends on `snake` state. Since the game loop captures a stale `snake`, the food-collision-avoidance logic in `generateFood` also operates on stale data — food can spawn on top of the (actual) snake body.
- **rAF loop continues after GAME_OVER**: After detecting a collision and calling `setGameStatus('GAME_OVER')`, the code still calls `requestAnimationFrame(gameLoop)` on the same tick before returning. The loop continues running one more frame before React processes the state change and the effect cleanup fires. While minor, it reflects the broader difficulty of mixing `requestAnimationFrame` with React state.
- **`initGame` dependency chain instability**: `initGame` depends on `generateFood`, which depends on `snake`. This means `initGame` is recreated on every snake state update, which in turn causes the mount `useEffect` (with `[initGame]` as dependency) to fire repeatedly — though in practice this is masked by the game immediately setting `PLAYING` state.
- **ProtectedRoute has no loading guard**: Unlike prompt 2's `AuthService` which loads from localStorage asynchronously, `ProtectedRoute` checks `isAuthenticated` synchronously. On page reload, before the `useEffect` in `AuthProvider` has fired, `isAuthenticated` is `false` — causing a brief redirect to `/login` even for authenticated users. There is no `isLoading` check in `ProtectedRoute` despite `isLoading` being in the auth state.
- **Prompt 5 not applied**: The project retains significant structural complexity: a `SignupPage` with no real registration logic (just redirects to login), an empty `utils/` directory, a separate `types/` folder with a single 3-line file, and multiple layers of abstraction (`AuthService` class + context + three hooks) that go beyond what is needed. Prompt 5 explicitly asked to simplify.
- **Hardcoded single credential**: Only `user@example.com / password` is accepted. The login form pre-fills these values, which is functional but hints at the rigidity of the fake auth.
- **CRA toolchain**: Uses deprecated `react-scripts` rather than Vite or another modern toolchain.

## Final verdict
Overall score: 31/60

Project 19 is a partial benchmark completion: prompts 1–3 are genuinely well-implemented with a thoughtful auth architecture, but the submission fails at prompt 4 with a broken Snake game caused by stale React state closures in a `requestAnimationFrame` loop. The agent acknowledged it could not fix the bug. Prompt 5 was not reached. The strong auth work and profile page bring the score up from a floor, but the broken game and missing simplification step keep it solidly below average.
