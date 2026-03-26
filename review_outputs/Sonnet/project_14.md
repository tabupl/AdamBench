# project_14 review

## Benchmark status
- Completed: no
- Failed step: Prompt 2 — "it added tests that were failing and was unable to fix them"
- Status summary: `status.md` explicitly reports `completed: false` and `failed: "At prompt 2 -> it added tests that were failing and was unable to fix them"`. Only Prompts 1 and 2 were attempted. Prompts 3 (profile page), 4 (snake game), and 5 (simplify) were never reached.

---

## Inspection log
- `projects/14/status.md`
- `projects/14/README.md`
- `projects/14/package.json`
- `projects/14/.vitest.config.ts`
- `projects/14/src/main.tsx`
- `projects/14/src/App.tsx`
- `projects/14/src/setup.ts`
- `projects/14/src/types/index.ts`
- `projects/14/src/context/AuthContext.tsx`
- `projects/14/src/hooks/useAuth.ts`
- `projects/14/src/hooks/useAuth.mock.ts`
- `projects/14/src/hooks/useAuth.test.tsx`
- `projects/14/src/services/auth.service.ts`
- `projects/14/src/services/auth.service.test.ts`
- `projects/14/src/services/auth.utils.test.ts`
- `projects/14/src/services/storage.service.ts`
- `projects/14/src/services/utils/auth.utils.ts`
- `projects/14/src/components/ProtectedRoute.tsx`
- `projects/14/src/pages/LoginPage.tsx`
- `projects/14/src/pages/DashboardPage.tsx`
- `projects/14/src/pages/HomePage.tsx`
- `projects/14/src/styles/global.css`

---

## Scores

- Task completion: 3/10
- Correctness: 4/10
- Code quality: 5/10
- Architecture / maintainability: 5/10
- Simplicity vs overengineering: 3/10
- Overall project quality: 4/10

---

## Summary

Project 14 completed only Prompts 1 and 2 before failing. Prompt 1 (login/dashboard/auth/protected routes) is largely functional with a well-styled UI and localStorage persistence. Prompt 2 (modular/testable auth) introduced a service layer, storage abstraction, and test files, but the tests are fundamentally broken — the `useAuth.test.tsx` uses an invalid Vitest spy pattern (`vi.spyOn(fn, 'call')`) that doesn't work for module-level functions, and the global test setup mocks `localStorage.setItem` to throw, making any test that writes to storage fail. Prompts 3, 4, and 5 (profile page, snake game, simplification) are entirely absent.

---

## Strengths

- **Prompt 1 is solidly implemented**: Login, dashboard, protected routes, and fake auth all work. The `AuthProvider`/`useAuth`/`auth.service` chain is functional. `localStorage` persistence means page refresh retains session.
- **Good visual quality**: `global.css` provides a polished, responsive UI with consistent design — gradient buttons, card layouts, spinner, responsive grid.
- **`auth.service.ts` is well-structured**: Pure functions for `authenticateUser`, `storeUser`, `removeUser`, `getCurrentUser`, and `isUserAuthenticated`. Correctly throws on invalid credentials, validates email format and password length.
- **`auth.service.test.ts` tests are mostly sound**: The service-level tests correctly assert success/failure paths for `authenticateUser`, `getMockUsers`, and `doesEmailExist`. These likely pass independently of the broken hook tests.
- **`StorageService` abstraction is reasonable**: Separating localStorage access into a service object (with `getUser`, `setUser`, `checkAuth`) is a valid testability pattern.
- **`ProtectedRoute` uses `<Outlet />`**: Correctly uses the React Router v6 layout route pattern rather than wrapping children directly.

---

## Weaknesses

- **Prompts 3, 4, and 5 are entirely missing**: No profile page, no snake game, no simplification. The `src/routes/` folder is completely empty. The dashboard has a "Profile Settings" link to `/profile` which leads nowhere.

- **`useAuth.test.tsx` tests are broken — invalid spy pattern**: Every test uses `vi.spyOn(authService.getCurrentUser, 'call').mockReturnValue(...)`. `vi.spyOn` takes an object and a method name, not a function and `'call'`. This pattern silently fails — the spies are not applied, the real implementations run, and `localStorage` calls hit the global mock that throws. The tests for login success will fail because `storeUser()` calls `localStorage.setItem` which is mocked to throw in `setup.ts`.

- **`setup.ts` global localStorage mock is self-defeating**: Globally mocking `localStorage.setItem` to throw `'localStorage not allowed'` means any code path that writes to storage fails in all tests — including the legitimate ones in `auth.service.test.ts` that verify authenticated users are stored. This is an incoherent testing strategy: the setup sabotages the very behavior the tests are trying to verify.

- **`useAuth` hook takes `children: ReactNode` as its first parameter**: A hook receiving `children` is semantically wrong and leaks component concerns into hook logic. It exists only to thread into a `useEffect` dependency array (`[children, isLoadingDelay]`), meaning the auth check re-runs every time any child re-renders — a serious performance and correctness issue.

- **`loginFailed` is hardcoded to `false` in `AuthContext`**: The `loginFailed` value in the context is set to `const loginFailed = false` with a comment "Will be passed from LoginPage", then never actually connected. Login errors cannot be communicated through the context.

- **`LoginPage` uses `useLogin` which creates a second `useAuth` instance**: `useLogin` calls `useAuth(null, 0)` creating a fresh hook instance with its own state, entirely separate from the `AuthProvider`'s instance. Logging in via `LoginPage` will update this isolated state but not the `AuthContext`, so `ProtectedRoute` (which reads from yet another `useAuth(null, 0)` instance) may not see the updated authentication state.

- **Multiple competing `useAuth` instances**: `AuthProvider` calls `useAuth(children, 100)`, `ProtectedRoute` calls `useAuth(null, 0)`, `DashboardPage` calls `useAuth(null, 0)`, and `LoginPage` uses `useLogin` which calls `useAuth(null, 0)`. Because `useAuth` reads from localStorage (not from shared context state), these are semi-independent — but the timing of the 100ms `checkAuth` delay in `AuthProvider` vs. 0ms in `ProtectedRoute` could cause divergent states.

- **Overengineered for the task**: `auth.utils.ts` contains `generateActivityText`, `generateActivities`, `calculateStat`, `formatCurrency`, `formatDuration` — utilities with no connection to authentication. The `ActivityType` parameter in `generateActivityText` is marked `void type` (intentionally unused). This is scaffolding that adds complexity without serving any benchmark requirement.

- **`User` type includes `password` field**: Storing the password on the user object and returning it from `authenticateUser` is a security anti-pattern. The `auth.service.test.ts` even asserts `expect((user as User).password).toBe('password')`, normalising the exposure of plaintext passwords in user state.

---

## Final verdict

Overall score: 24/100

Project 14 has a well-styled Prompt 1 implementation and a reasonable service-layer architecture intention, but failed at Prompt 2 because the test infrastructure is fundamentally broken in multiple ways — invalid spy patterns, a self-defeating localStorage mock, and multiple competing `useAuth` hook instances that prevent the auth state from being shared correctly. Three out of five benchmark prompts were never attempted, and the overengineering added during Prompt 2 (utility functions, activity generators, extra layers) added complexity without resolving the core problems.
