# project_21 review

## Benchmark status
- Completed: no
- Failed step: Prompt 3 (profile page introduced a routing bug the agent could not fix)
- Status summary: The agent self-reports failure on Prompt 3. Source inspection confirms: the ProfilePage exists but contains a critical Rules-of-Hooks violation (`useAuth()` called inside `useEffect`). Prompts 4 (Snake game) and 5 (Simplify) were never attempted. The login flow also has a logic bug in AuthContext where state is never updated after a successful login call.

## Inspection log
- projects/21/status.md
- projects/21/client/package.json
- projects/21/client/src/main.tsx
- projects/21/client/src/routes/AppRoutes.tsx
- projects/21/client/src/routes/routeComponents.tsx
- projects/21/client/src/context/AuthContext.tsx
- projects/21/client/src/context/useAuthWithNavigate.tsx
- projects/21/client/src/utils/authService.ts
- projects/21/client/src/utils/authStorage.ts
- projects/21/client/src/utils/clearAuth.ts
- projects/21/client/src/utils/authService.test.ts
- projects/21/client/src/types/auth.ts
- projects/21/client/src/pages/LoginPage.tsx
- projects/21/client/src/pages/DashboardPage.tsx
- projects/21/client/src/pages/ProfilePage.tsx
- projects/21/client/src/pages/AdminDashboardPage.tsx
- projects/21/client/src/pages/TestAuthPage.tsx
- projects/21/client/src/components/MainLayout.tsx
- projects/21/client/src/components/ProtectedRoute.tsx
- projects/21/client/src/styles/globals.css

## Scores
- Task completion: 3/10
- Correctness: 3/10
- Code quality: 5/10
- Architecture / maintainability: 4/10
- Simplicity vs overengineering: 3/10
- Overall project quality: 3/10

## Summary
Project 21 completed Prompts 1 and 2 reasonably well (login page, dashboard, protected routes, and a modularised auth service with tests), but failed during Prompt 3 and never recovered. The ProfilePage contains a hard crash (React Hook called inside `useEffect`) and the `AuthContext.login` method never updates the React state after a successful login, meaning the app would not behave correctly even before the profile bug. Prompts 4 (Snake game) and 5 (simplification) are entirely absent.

## Strengths
- Authentication logic is properly separated into `authService`, `authStorage`, and `AuthContext`, showing genuine effort at modularity (Prompt 2).
- Unit tests for `authService` are present and well-structured, covering login, logout, and mock API replacement.
- TypeScript types are well-defined in `types/auth.ts`.
- CSS is reasonably organised and contains responsive breakpoints.

## Weaknesses
- **Critical hook violation in ProfilePage**: `useAuth()` is called inside a `useEffect` callback, which violates React's Rules of Hooks and will throw at runtime.
- **AuthContext.login never updates React state**: After `authService.login()` stores the user in localStorage, `setState` is never called in the `login` handler — meaning `isAuthenticated` remains `false` and the ProtectedRoute immediately redirects away. Navigation relies on `loginWithRedirect` calling `navigate` before context state settles, which is fragile and likely to break.
- **MainLayout is unused**: It renders an `<Outlet />` but is never mounted in `AppRoutes.tsx`, so the navbar defined there is never shown.
- **Duplicate ProtectedRoute implementations**: `components/ProtectedRoute.tsx` (using `<Outlet />`) and `routes/routeComponents.tsx` (using `children` prop) coexist; only the latter is used, leaving dead code.
- **Duplicate globals.css**: Exists at both `src/globals.css` and `src/styles/globals.css`.
- **No Snake game page** (Prompt 4) — entirely missing.
- **No simplification pass** (Prompt 5) — project has grown more complex, not simpler.
- Excessive `console.log` statements throughout production code.
- `TestAuthPage` auto-clears localStorage and reloads on mount, a debugging artifact left in production code and registered as a public route.

## Final verdict
Overall score: 21/100

The project shows decent foundational intent — types, service layer, tests — but is undermined by functional correctness failures that prevent the app from working end-to-end. The login flow is broken at the context state level, the profile page crashes with a hooks violation, and two of the five benchmark prompts (Snake game and simplification) are entirely absent. The score reflects partial completion of the first two prompts only, with meaningful bugs even there.
