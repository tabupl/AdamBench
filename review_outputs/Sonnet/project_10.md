# project_10 review

## Benchmark status
- Completed: no
- Failed step: Prompt 4 — snake game was introduced with multiple bugs that were not fixed
- Status summary: The project self-reports failure on prompt 4. Source code inspection confirms this and reveals additional bugs beyond the snake game. Prompts 1–3 were reached, though the auth context has a fundamental reactivity flaw. The snake game has at least five distinct, independently game-breaking bugs. Prompt 5 (simplification) was not reached.

## Inspection log
- `projects/10/status.md`
- `projects/10/my-react-app/src/main.tsx`
- `projects/10/my-react-app/src/App.tsx`
- `projects/10/my-react-app/src/context/AuthContext.tsx`
- `projects/10/my-react-app/src/context/AuthTypes.ts`
- `projects/10/my-react-app/src/services/AuthService.ts`
- `projects/10/my-react-app/src/components/ProtectedRoute.tsx`
- `projects/10/my-react-app/src/components/ErrorBoundary.tsx`
- `projects/10/my-react-app/src/pages/Login.tsx`
- `projects/10/my-react-app/src/pages/Dashboard.tsx`
- `projects/10/my-react-app/src/pages/Profile.tsx`
- `projects/10/my-react-app/src/pages/Snake.tsx`
- `projects/10/my-react-app/src/pages/Snake.css`
- `projects/10/my-react-app/src/App.css`
- `projects/10/my-react-app/src/index.css`
- `projects/10/my-react-app/package.json`
- `projects/10/my-react-app/vite.config.ts`
- `projects/10/my-react-app/index.html`

## Scores
- Task completion: 4/10
- Correctness: 3/10
- Code quality: 5/10
- Architecture / maintainability: 5/10
- Simplicity vs overengineering: 4/10
- Overall project quality: 4/10

## Summary
Project 10 reaches prompts 1–3 in terms of file structure — a login page, dashboard, profile page, a modular `FakeAuthService` class, protected routes, and a snake page all exist. However, the auth context has a non-reactive design flaw that prevents UI updates after login/logout, and the snake game is broken in at least five independent ways, ranging from food always teleporting on every render to coordinates being compared in the wrong axis. Prompt 5 was never reached, and the project correctly self-reports failure on prompt 4.

## Strengths
- **Modular `FakeAuthService`**: The `AuthService.ts` is a well-structured class with clean `login`, `logout`, `updateProfile`, and `getState` methods, localStorage persistence, and a singleton export. This shows good instincts for prompt 2's modularity requirement.
- **Profile page is correct in isolation**: `Profile.tsx` has proper controlled inputs for name and email, an `onChange` handler, and submits via `updateProfile`. The basic structure is right.
- **Dashboard has logout and profile navigation**: `Dashboard.tsx` uses `useAuth`, shows the user's name, has a logout button and a `Link` to `/profile`.
- **Snake is on a public route**: `/snake` is not wrapped in `ProtectedRoute`, satisfying the unauthenticated access requirement of prompt 4.
- **Snake page has rules and controls text**: The rendered JSX includes a "Goal" description and "Controls" section with arrow key instructions.
- **`ErrorBoundary` was added to contain snake crashes**: Shows awareness that the snake was unstable.
- **Good file organisation**: `services/`, `context/`, `components/`, `pages/` are all used correctly for their intended purposes.

## Weaknesses

### Auth / Prompts 1–3

- **`AuthContext` is non-reactive**: `authService.getState()` is called once at the top level of `AuthProvider`, not inside a `useState` or `useReducer`. This means `user` and `isAuthenticated` are fixed snapshot values captured at first render. After `login()` or `logout()` mutate the service's internal state, no React state update is triggered, so all consumers of `useAuth()` will never re-render with the new values. The `ProtectedRoute` and `Dashboard` will display stale data. The auth technically navigates (via `useNavigate`), but the context values remain frozen.
- **`ProtectedRoute` bypasses context entirely**: It reads directly from `authService.getState()` rather than `useAuth()`, which avoids the reactivity bug above but means the two auth checks are inconsistent — one goes through context, the other doesn't.
- **Login page has no credentials UI**: `Login.tsx` is a single "Fake Login" button with no username or password fields. This barely satisfies prompt 1's spirit of a login page. The `login()` call takes no arguments and always succeeds with a hardcoded user.
- **`updateProfile` saves to service but context never re-renders**: Since `AuthProvider` reads state once and the service mutates in place, a profile save in `Profile.tsx` updates localStorage but the UI (e.g., `user.name` on the dashboard) will not reflect the change without a full page reload.
- **`ErrorBoundary.tsx` has an invalid import**: `import { Component, Error as ReactError } from 'react'` — React does not export `Error`. The native JavaScript `Error` class is being aliased via a broken import. This will cause a TypeScript compilation error. The `Error as ReactError` type alias should simply reference the global `Error` type.

### Snake Game / Prompt 4

- **`generateFood()` called bare in render body**: The line `generateFood()` appears unconditionally in the component body, outside any hook or event handler. This causes food to be placed at a new random position on *every render cycle*, making the food jump around continuously and preventing the player from ever reaching it.
- **Food collision uses wrong coordinate axis**: In `gameTick`, the food collision check is `newHead[0] === foodRef.current.x && newHead[1] === foodRef.current.y`. Snake segments are stored as `[row, col]`, so `newHead[0]` is the **row**. Food is stored as `{x: col, y: row}` (from `generateFood`). The check therefore compares `row === x (col)` and `col === y (row)` — the axes are swapped. Food can only be accidentally eaten when the snake happens to be at the coordinate where row equals col (the diagonal), which is rare and incorrect.
- **Draw `useEffect` uses ref values as dependencies**: `useEffect(() => { draw(); }, [snakeRef.current, foodRef.current])` — `snakeRef.current` and `foodRef.current` are mutable ref object values, not reactive state. React does not track changes to `.current` for dependency comparison. This effect runs only once on mount and never again, meaning the canvas is never redrawn as the game progresses.
- **No reverse-direction guard**: The `handleKey` callback sets direction directly without checking the opposite direction. Pressing ArrowUp while moving down (initial direction is right, but if a player goes down then immediately up) would cause the snake to reverse into itself without triggering a self-collision on that tick, because self-collision is checked on `snakeRef.current.slice(1)` which excludes the head — a classic snake inversion bug.
- **`snakeRef` starts empty, not seeded with initial state**: `snakeRef` is initialised as `useRef<number[][]>([])`. It is only populated when the `useEffect(() => { snakeRef.current = snake }, [snake])` fires after the first render. However, `gameTick` (via `setInterval`) can fire before that effect runs (especially in StrictMode with double-invocation), causing `computeNewHead` to hit the `snakeRef.current.length === 0` guard and return `[0,0]`, immediately triggering a spurious wall collision at position (0,0) which has `x=0 >= 0` — this passes the wall check but the snake head at `[0,0]` means the game may misbehave from the first tick.
- **Excessive `console.log` left in production code**: The `gameTick` and `handleKey` callbacks are littered with debug statements (`console.log('tick running')`, `console.log('Wall collision detected')`, etc.), including one that logs "Wall collision detected" unconditionally on every tick regardless of whether a collision occurred.

### Prompt 5
- Not reached; `App.css` and `index.css` are unmodified Vite scaffolding templates with no relevance to this project.

## Final verdict
Overall score: 38/100

Project 10 shows reasonable architectural intentions — a modular auth service class, clean page separation, and a well-typed context interface — but execution falls short at every layer. The auth context is non-reactive, meaning UI state never updates after login. The snake game accumulated at least five distinct bugs (food teleporting on every render, coordinate axis mismatch in collision detection, a draw effect that never fires, no direction reversal guard, and an empty snake ref at startup), confirming the self-reported failure. The project is incomplete and broken at its most complex feature.
