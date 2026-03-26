# project_2 review

## Benchmark status
- Completed: yes (self-reported)
- Failed step: Prompt 3 (profile page is entirely missing)
- Status summary: `status.md` reports `Completed: true`, `Failed: null`. However, source code inspection reveals that no profile page exists — Prompt 3 is not implemented. The project successfully delivers Prompts 1, 2, 4, and 5.

---

## Inspection log
- `prompts/prompt1.md`
- `prompts/prompt2.md`
- `prompts/prompt3.md`
- `prompts/prompt4.md`
- `prompts/prompt5.md`
- `projects/2/status.md`
- `projects/2/package.json`
- `projects/2/vite.config.ts`
- `projects/2/eslint.config.js`
- `projects/2/src/main.tsx`
- `projects/2/src/App.tsx`
- `projects/2/src/context/AuthContext.tsx`
- `projects/2/src/components/PrivateRoute.tsx`
- `projects/2/src/pages/LoginPage.tsx`
- `projects/2/src/pages/LoginPage.module.css`
- `projects/2/src/pages/DashboardPage.tsx`
- `projects/2/src/pages/DashboardPage.module.css`
- `projects/2/src/pages/SnakePage.tsx`
- `projects/2/src/pages/SnakePage.module.css`
- `projects/2/src/styles/index.css`
- `projects/2/src/types/vite-env.d.ts`
- Directory listings: `src/`, `src/hooks/`, `src/utils/`
- Glob: `projects/2/src/**/*.tsx` (confirmed all TSX files)

---

## Scores

- Task completion: 6/10
- Correctness: 7/10
- Code quality: 8/10
- Architecture / maintainability: 8/10
- Simplicity vs overengineering: 8/10
- Overall project quality: 7/10

---

## Summary

Project 2 is a clean, well-structured React + TypeScript app that correctly implements Prompts 1, 2, 4, and 5, but is missing the profile page required by Prompt 3 entirely — there is no `ProfilePage.tsx`, no profile route in `App.tsx`, and no profile editing logic anywhere in the codebase. The authentication architecture is properly done with React Context and a shared `AuthProvider`, which is a clear improvement over a context-free hook approach. The Snake game is fully playable with rules and controls on the page, accessible without authentication.

---

## Strengths

- **Prompt 1**: Login page, Dashboard, fake authentication with hardcoded users, and `PrivateRoute` protection are all correctly implemented. Auth state is properly shared via React Context.
- **Prompt 2**: Auth is cleanly refactored into `AuthContext.tsx` using `createContext`/`useContext`/`AuthProvider`. The `useAuth` hook is exported with a proper guard (`throws if used outside AuthProvider`). This is the architecturally correct pattern for shared auth state.
- **Prompt 4**: Snake game at `/snake` is unauthenticated (no `PrivateRoute` wrapping), uses a direction ref for stable key handling, has proper wall and self-collision detection, speed acceleration on food consumption, and includes clearly formatted **Rules** and **Controls** sections directly on the page.
- **Prompt 5**: Structure is reasonably lean — one context, one component, three pages, CSS Modules per page. No unnecessary abstractions.
- CSS Modules usage throughout is a clean, scoped styling approach.
- `PrivateRoute` handles the `isLoading` state gracefully to prevent premature redirects on session restore.
- The ESLint config is detailed and properly set up with TypeScript and React hooks plugins.

---

## Weaknesses

- **Prompt 3 entirely missing**: There is no profile page. No `ProfilePage.tsx`, no `/profile` route in `App.tsx`, no `updateProfile` method in `AuthContext`, and no navigation link to a profile page from the Dashboard. This is a complete omission of one of the five benchmark requirements. The `status.md` incorrectly claims full completion.
- **Snake game speed-management bug**: The `moveSnake` callback is listed in the `useEffect` dependency array alongside `speed`. When `speed` changes, `moveSnake` is recreated, and the outer `useEffect` tears down and restarts the interval — but `moveSnake` itself also tries to restart the interval internally on food eat. This creates a double-restart risk and makes the speed behavior unreliable.
- **`DashboardPage.module.css` contains `.profileButton` style**: This CSS rule is defined but the button is never rendered in `DashboardPage.tsx`, suggesting the profile feature was started or planned but then dropped — a dead code artefact.
- **Empty directories**: `src/hooks/` and `src/utils/` exist but are empty — residual clutter from a prior structure that was not cleaned up (undermining Prompt 5 slightly).
- `AuthContext` stores the full user object in `localStorage` under the key `auth_token` — the key name is semantically misleading (it stores a user object, not a token).
- User `id` is regenerated with `Math.random()` on every login; a returning user will have a different ID each session, which is a minor correctness issue.

---

## Final verdict

Overall score: 44/100 *(sum of individual scores)*

Project 2 is a well-written, properly architected React/TypeScript application with strong auth implementation and a working snake game — but it is objectively incomplete because Prompt 3 (user profile page with editable name and email) is entirely absent from the codebase. Four of five prompts are addressed with good quality, and the auth refactor (Prompt 2) is handled correctly with a proper Context/Provider pattern. The missing profile feature, combined with the incorrect `status.md` claim of full completion, keeps the score from being higher.
