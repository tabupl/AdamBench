# project_13 review

## Benchmark status
- Completed: yes (self-reported)
- Failed step: null
- Status summary: `status.md` reports `completed: true` and `failed: null`. All five benchmark prompts have corresponding implementations, but several are broken at a functional level due to a fundamental architecture flaw in the `useAuth` hook and other issues detailed below.

---

## Inspection log
- `projects/13/status.md`
- `projects/13/README.md`
- `projects/13/package.json`
- `projects/13/src/main.tsx`
- `projects/13/src/App.tsx`
- `projects/13/src/types/index.ts`
- `projects/13/src/services/AuthService.ts`
- `projects/13/src/services/AuthService.test.ts`
- `projects/13/src/context/AuthContext.tsx`
- `projects/13/src/hooks/useAuth.ts`
- `projects/13/src/components/ProtectedRoute.tsx`
- `projects/13/src/components/Navigation.tsx`
- `projects/13/src/pages/Login.tsx`
- `projects/13/src/pages/Dashboard.tsx`
- `projects/13/src/pages/Profile.tsx`
- `projects/13/src/pages/SnakeGame.tsx`
- `projects/13/src/test/setup.ts`
- `projects/13/src/index.css`

---

## Scores

- Task completion: 5/10
- Correctness: 3/10
- Code quality: 6/10
- Architecture / maintainability: 5/10
- Simplicity vs overengineering: 4/10
- Overall project quality: 4/10

---

## Summary

Project 13 is an architecturally ambitious attempt with a class-based `AuthService`, a separate `useAuth` hook, a context provider layer, tests, and a styled canvas snake game. However, a fundamental React anti-pattern in `useAuth` — returning values directly from a class singleton instead of from `useState` — means login likely doesn't trigger re-renders, breaking the entire authentication flow. The login page also reads a stale `loginSuccess` ref value, the profile save writes to the wrong localStorage key disconnected from the auth service, and the snake game page renders no rules or controls in its JSX despite CSS classes being defined for them.

---

## Strengths

- **Actual test file with meaningful coverage**: `AuthService.test.ts` tests login success/failure, logout, session loading, clearSession, avatar generation, and edge cases using Vitest and mocked localStorage. This is the most complete test suite in any project reviewed so far.
- **Clean layered architecture intent**: `AuthService` (class), `useAuth` (hook), `AuthContext` (provider), pages, components — a well-thought-out separation of concerns at design level.
- **Good TypeScript usage**: Centralized types in `types/index.ts`, `AuthServiceInterface` defined and implemented, proper generics and type guards throughout.
- **Routing structure is correct**: `/snake` is a public route; `/dashboard` and `/profile` are both wrapped with `ProtectedRoute`; redirect-after-login is implemented.
- **Real Vitest setup**: `test/setup.ts` with `@testing-library/jest-dom`, mocked `matchMedia`, and proper `beforeEach`/`afterEach` in tests.
- **Good visual design**: Well-styled CSS with a coherent design system, responsive layout, keyboard control styling, avatar display.

---

## Weaknesses

- **Critical: `useAuth` returns non-reactive values**: The hook returns `user: authService.getCurrentUser()` and `isAuthenticated: !!authService.getCurrentUser()` computed at call time from a mutable class singleton — not from `useState`. When `authService.login()` updates the class's private `user` field, no React state update is triggered, so React has no reason to re-render. After `await login(...)`, the UI will not reflect the authenticated state, and `ProtectedRoute` will continue to see `isAuthenticated: false`.

- **Critical: Login navigation is broken**: `Login.tsx` checks `if (loginSuccess)` immediately after `await login(...)`. But `loginSuccess` is read from the component's render-time value of `authState.current.loginSuccess` (a `useRef`). Since `useRef` mutations don't trigger re-renders, the `loginSuccess` value visible in the render is the stale value from before the login call, always `false`. The `navigate(from)` call will never execute.

- **Profile save is broken / disconnected from auth**: `Profile.tsx` saves the updated user to `localStorage` with key `'user'`, but `AuthService` uses key `'omnicoder_user'`. The profile update is never reflected in the auth state or visible to the rest of the app. The code itself has comments acknowledging this: *"This is a workaround... In a real app, you'd need to update the context or use a different approach."*

- **Snake game missing rules and controls on page**: `SnakeGame.tsx` renders only a `<canvas>`, a score line, and a Start/Restart button. The `index.css` defines `.game-rules`, `.keyboard-controls`, and `.key-row` CSS classes but these are never used in the JSX. Prompt 4 explicitly requires rules and controls to be written on the page — this requirement is not met.

- **`getNextUserId()` always returns `'4'`**: The method iterates from `id=3` looking for an ID not in `Object.keys(USER_DB)` which is `['1','2','3']`. It finds `4` immediately and returns it every time. All authenticated users are assigned ID `'4'` regardless of which account they log into.

- **`loginFailure` and `loginSuccess` are always stale in renders**: Both are stored in `authState.current` (a `useRef`), which means they are never reflected in renders. `loginFailure` being always `false` in the rendered error div (`{loginFailure && 'Invalid email or password'}`) means login errors are never displayed.

- **Overengineered for the task**: The `AuthService` class, singleton pattern, `useAuth` hook, `AuthContext` wrapper, `useAuthManual`, `useAuthError` — this architecture adds significant complexity without delivering a working result. `useAuthError` is defined but never used anywhere.

- **`AuthContextType` duplicated**: The interface is defined both in `types/index.ts` and in `context/AuthContext.tsx` with slightly different signatures.

- **Navigation shown on Login page**: `Login.tsx` renders `<Navigation />` which links to `/dashboard`, `/snake`, and `/profile`. A login page shouldn't show app-level navigation to protected pages.

- **`isLoading` is hardcoded to `false`**: The `useAuth` hook always returns `isLoading: false`. Session restore from `localStorage` is async (`loadUserFromStorage`), but its result is not awaited or reflected in loading state, causing `ProtectedRoute` to immediately redirect before checking storage.

---

## Final verdict

Overall score: 27/100

Project 13 shows genuine architectural ambition — a class-based service, hook abstraction, context provider, and real tests — but the core authentication mechanism is fundamentally broken due to returning non-reactive class method results instead of React state. This single flaw cascades into login not working, protected routes not unblocking, profile edits being disconnected, and error states never displaying. The snake game also fails to render its required rules and controls. The tests are the strongest part of the submission, but they test the service class in isolation and cannot catch the React integration failures.
