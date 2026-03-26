# project_7 review

## Benchmark status
- Completed: no
- Failed step: Prompt 1 — the app fails immediately; `status.md` explicitly states "failed: on first task -> url shows 404"
- Status summary: The project self-reports failure on the very first benchmark prompt. Source code inspection confirms this and reveals the codebase is broken at a fundamental structural level, with cascading issues that prevent any of the 5 prompts from being considered satisfied.

## Inspection log
- `projects/7/status.md`
- `projects/7/src/App.ts`
- `projects/7/src/App.tsx.ts`
- `projects/7/src/context/AuthContext.tsx`
- `projects/7/src/context/ProtectedContext.tsx`
- `projects/7/src/services/protectedRouteService.ts`
- `projects/7/src/pages/LoginPage.tsx`
- `projects/7/src/pages/RegisterPage.tsx`
- `projects/7/src/pages/ProtectedRoutePage.tsx`
- `projects/7/src/types/auth.ts`
- `projects/7/src/styles/main.css`
- `projects/7/package.json`
- `projects/7/tsconfig.json`
- `projects/7/vite.config.ts`
- `projects/7/public/index.html`
- `projects/7/README.md`
- (glob searched for all .tsx, .ts, main*, index* files in src/)

## Scores
- Task completion: 1/10
- Correctness: 1/10
- Code quality: 2/10
- Architecture / maintainability: 2/10
- Simplicity vs overengineering: 2/10
- Overall project quality: 1/10

## Summary
Project 7 fails to satisfy even the first benchmark prompt. There is no application entry point (`main.tsx` / `index.tsx` is completely absent), the main component file is incorrectly named `App.ts` (a plain TypeScript file, not a TSX file) with a duplicate variant called `App.tsx.ts`, and `DashboardPage.tsx` — imported in App — does not exist. No profile page, no snake game, and no working auth logic are present, confirming the self-reported failure. The CSS and type definitions have some effort, but the rest of the codebase is riddled with broken, placeholder, and syntactically invalid code.

## Strengths
- `src/types/auth.ts` defines clean, well-typed interfaces (`User`, `AuthState`, `LoginFormData`).
- `src/styles/main.css` is reasonably styled and organised.
- The intention to use React Context for auth and a service layer for route protection is architecturally sensible, even if never realised.
- Vite and React 18 were chosen as a modern, appropriate stack.

## Weaknesses
- **No application entry point**: There is no `main.tsx` or `index.tsx` in `src/`. Vite cannot boot the app at all; this alone explains the 404.
- **Wrong file extensions**: The main component is `App.ts` (not TSX), preventing JSX from being parsed. There is also a `App.tsx.ts` duplicate containing a syntax error (`async mockAuth.login(credentials)` is not valid JavaScript/TypeScript).
- **Missing pages**: `DashboardPage.tsx` is imported in `App.ts` but does not exist anywhere in the project. There is no `ProfilePage.tsx` (prompt 3) and no `SnakeGamePage.tsx` (prompt 4).
- **Broken `AuthContext.tsx`**: References an undefined `mockAuth` global, calls `useCallback` with `mockAuth` as a dependency (invalid), and has a duplicate `login` key in the context value object — all fatal compile/runtime errors.
- **Hooks called outside React components**: `protectedRouteService.ts` calls `useAuth()`, `useNavigate()`, and `useLocation()` inside a plain async service function — a fundamental violation of the Rules of Hooks.
- **`ProtectedContext.tsx`**: Destructures properties directly from the context object (`AuthContext`) as if it were a plain value object rather than a React context, which would always be `undefined`.
- **`LoginPage.tsx` and `RegisterPage.tsx`**: Both contain `useEffect` hooks that call `mockAuth.login()` unconditionally on every `formData` change, trigger on mount with empty credentials, and reference undefined state setters (`setAuthState`). This would cause infinite loops and runtime crashes.
- **`RegisterPage.tsx`**: Missing all imports (`useState`, `useEffect`, `useNavigate`, `Link`, `useAuth`, `LoginFormData`) — it would fail to compile entirely.
- **No protected route mechanism**: There is no actual route guard. `ProtectedContext` is misused as a layout wrapper, and it renders its own UI instead of conditionally rendering children.
- **Prompts 2–5 not attempted**: Auth refactor, profile page, snake game, and structure simplification are all absent.
- **Unnecessary dependencies**: `@tanstack/react-query`, `@tanstack/react-table`, and `axios` are installed but never used in any source file.
- **`public/index.html`** still uses `%PUBLIC_URL%` placeholders, which is a CRA convention incompatible with Vite (Vite uses `/` or `./` paths).

## Final verdict
Overall score: 9/100

Project 7 is non-functional at the most basic level: no entry point, wrong file extensions, missing pages, broken hooks usage, syntax errors, and undefined references throughout. Only the type definitions and CSS demonstrate meaningful effort. The project fails prompt 1 as self-reported, and none of the subsequent prompts were addressed.
