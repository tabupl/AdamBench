# Final ranking

## Method

All 25 individual review files were read and cross-compared. A key finding during synthesis was that the reviews were produced in five batches, each using a different scoring convention: batches 1 and 3 reported the sum of all six score lines (five categories + one overall quality line, max 60) as a "/100" figure; batch 4 explicitly used a "/60" scale; and batches 2 and 5 used holistic "/100" judgments. All scores were therefore normalised to a consistent /100 scale using the rule that a sum-of-six of X/60 converts to round(X/60 × 100), while explicitly holistic /100 scores were kept or lightly adjusted for cross-batch consistency. One error was also corrected: project_15's sum was recorded as 34 (five categories only) instead of the correct 40 (six lines), which was factored into the normalised score. Final rankings were then ordered by calibrated score with qualitative tie-breaking based on the severity of implementation failures described in each review.

---

## Ranking

1. project_16 — score: 96/100
2. project_23 — score: 93/100
3. project_6  — score: 83/100
4. project_18 — score: 80/100
5. project_22 — score: 79/100
6. project_3  — score: 74/100
7. project_1  — score: 70/100
8. project_24 — score: 68/100
9. project_8  — score: 67/100
10. project_11 — score: 65/100
11. project_2  — score: 63/100
12. project_15 — score: 60/100
13. project_12 — score: 60/100
14. project_25 — score: 55/100
15. project_9  — score: 52/100
16. project_20 — score: 48/100
17. project_4  — score: 45/100
18. project_19 — score: 45/100
19. project_13 — score: 35/100
20. project_10 — score: 32/100
21. project_5  — score: 30/100
22. project_14 — score: 28/100
23. project_21 — score: 21/100
24. project_17 — score: 18/100
25. project_7  — score: 9/100

---

## Tier list

### S tier
- project_16
- project_23

### A tier
- project_6
- project_18
- project_22
- project_3

### B tier
- project_1
- project_24
- project_8
- project_11
- project_2

### C tier
- project_15
- project_12
- project_25
- project_9
- project_20

### D tier
- project_4
- project_19
- project_13
- project_10
- project_5
- project_14
- project_21
- project_17
- project_7

---

## Top 5 projects

### project_16 (96/100)
All five benchmark prompts are fully and correctly implemented in a remarkably lean codebase of just eight source files. The auth module is genuinely modular and testable, the snake game avoids stale-closure issues with a `directionRef`, the profile page persists edits through context, and the flat `src/` structure honours the simplification requirement perfectly. The only trivial deductions are a single empty `styles/` folder and a minor profile-form re-initialisation edge case.

### project_23 (93/100)
The strongest submission architecturally: auth logic is split across context, typed errors, and dedicated hooks (`useLogin`, `useProfile`), and the snake game uses a `useRef`-based data model that eliminates stale closures entirely. Two comprehensive test suites (`useLogin.test.tsx`, `useProfile.test.tsx`) exercise real user interactions via `@testing-library/user-event`, making this the only project that genuinely demonstrates the "testable" requirement of Prompt 2. Minor deductions for incorrect vitest coverage paths and a default-boilerplate README.

### project_6 (83/100)
A clean, complete React/TypeScript app satisfying all five prompts with solid idiomatic code. Auth utility functions are kept pure and separate from the React context for easy isolated testing, profile editing persists through localStorage, and the canvas snake game has correct collision detection and directional safety. The main weaknesses are two empty "zombie" files (`authService.ts`, `ProtectedRoute.tsx`) that contradict the simplify-structure requirement, and a minor stale-closure risk in the snake direction state.

### project_18 (80/100)
All five prompts are delivered with polished, well-organised code across a flat file structure. The auth module is correctly structured with an `isLoading` hydration guard, the profile page has async save with success feedback, and the snake game supports both Arrow and WASD keys with a clear rules/controls section. The primary technical deduction is a game-loop correctness bug where `score` in the `useEffect` dependency array causes the interval to be torn down and restarted on every food pickup, plus some hardcoded fake users and unused scaffold assets.

### project_22 (79/100)
A solid, fully-completed benchmark submission with clean minimal architecture: one context file, one component, four pages, and one types file. The snake game is polished with `directionRef`, mobile D-pad controls, and localStorage high-score persistence. The `ProtectedRoute` correctly handles the loading state. The main defect is a password-loss bug in `updateUser`: after deleting a key from the in-memory `FAKE_USERS` map, the code tries to read its password back from the (now-deleted) key, causing the password to become `undefined` after any profile update.

---

## Bottom 5 projects

### project_21 (21/100)
The project failed at Prompt 3 with a hard crash: `useAuth()` is called inside a `useEffect` callback, violating React's Rules of Hooks. Compounding this, `AuthContext.login` never calls `setState` after storing the user, meaning `isAuthenticated` remains `false` after a successful login and `ProtectedRoute` immediately redirects away. Prompts 4 (Snake game) and 5 (simplification) were never attempted. The codebase shows good intent in type definitions and service separation, but is non-functional end-to-end.

### project_17 (18/100)
The final submitted state contains only a single page — the Snake game. During Prompt 5's simplification pass, the agent deleted all other work: the login page, dashboard, profile page, auth module, protected routes, and all auth infrastructure are completely absent. The `status.md` itself acknowledges this, but the benchmark must be evaluated on the final deliverable. The snake game implementation is technically sound (correct collision detection, `directionRef` pattern), but four out of five benchmark prompts have no surviving code.

### project_7 (9/100)
Non-functional from the most basic level: there is no application entry point (`main.tsx`/`index.tsx` is absent), the main component is named `App.ts` (not TSX), JSX cannot be parsed, and the one page component imported (`DashboardPage`) does not exist. The self-reported failure on Prompt 1 is confirmed. `AuthContext` references an undefined `mockAuth` global, hooks are called inside plain service functions violating the Rules of Hooks, and multiple files have syntax errors. Only the TypeScript type definitions and CSS file show meaningful effort.

### project_14 (28/100)
Failed at Prompt 2 when tests it added could not be made to pass, and the agent gave up. Only Prompts 1 and 2 were attempted. The tests are broken at multiple levels: `vi.spyOn(fn, 'call')` is an invalid Vitest spy pattern, and the global test setup mocks `localStorage.setItem` to throw — sabotaging the very functionality the tests are trying to verify. Additional architecture problems include multiple competing `useAuth` instances that prevent shared auth state, and `loginFailed` hardcoded to `false` in context. Prompts 3, 4, and 5 are entirely missing.

### project_5 (30/100)
The most fundamental broken-dependency issue in the set: Tailwind CSS utility classes are used on every component across the entire app, but Tailwind is not installed (no dependency, no config, no `@tailwind` directives). The entire UI renders completely unstyled at runtime. Compounding this, the snake game was left in a debug state with a visible yellow debug-info panel, coordinate overlays on every cell, and `console.log` calls on every game tick. Profile saving uses a hardcoded `'password'` workaround that only works for one of the two demo users. The project was clearly not reviewed before submission.

---

## Consistency adjustments

- **project_1** — old score: 44/100 (stated in review as sum-of-6/60) → new score: **70/100**
  The sum-of-6 score of 44/60 converts to ~73%; adjusted slightly down to 70 to account for the architectural flaw (missing React Context for shared auth state), which is meaningful for a "modular auth" benchmark.

- **project_2** — old score: 44/100 (stated in review as sum-of-6/60) → new score: **63/100**
  Same raw sum as project_1, but project_2 is missing an entire benchmark prompt (profile page), which warrants a larger penalty. Normalised to 63 to reflect the missing feature.

- **project_3** — old score: 50/100 (stated in review as sum-of-6/60) → new score: **74/100**
  50/60 converts to ~83%; adjusted down to 74 because the broken `vite.config.ts` test setup reference and the stale README are real regressions not fully captured in the sum, and because P6 (83/100) is objectively cleaner with fewer issues.

- **project_4** — old score: 32/100 (stated as sum-of-6/60) → new score: **45/100**
  32/60 = ~53%; adjusted slightly down to 45 because profile saving being explicitly self-acknowledged as non-functional and the double-`AuthProvider` structural bug are both critical correctness failures.

- **project_5** — old score: 25/100 (stated as sum-of-6/60) → new score: **30/100**
  25/60 = ~42%; adjusted down to 30 because missing Tailwind dependency makes the entire UI visually broken at runtime and the snake game was left in an obvious debug state — both more severe failures than the sum suggests. Score placed below project_10 (32) to reflect that project_5's UI is entirely non-functional visually while project_10 at least renders correctly.

- **project_11** — old score: 41/100 (stated as sum-of-6/60) → new score: **65/100**
  41/60 = ~68%; adjusted slightly down to 65 because the fabricated README describing architecture that does not exist and coverage artifacts for zero test files are integrity issues beyond the category scores.

- **project_12** — old score: 40/100 (stated as sum-of-6/60) → new score: **60/100**
  40/60 = ~67%; adjusted to 60 to reflect the multiple correctness issues in the snake game and the no-op Prompt 2 refactor.

- **project_13** — old score: 27/100 (stated as sum-of-6/60) → new score: **35/100**
  27/60 = ~45%; adjusted down to 35 because the authentication mechanism is fundamentally non-functional (non-reactive class returns instead of React state), which is a more severe failure than the category scores imply.

- **project_14** — old score: 24/100 (stated as sum-of-6/60) → new score: **28/100**
  24/60 = ~40%; adjusted down to 28 because only 2 of 5 prompts were attempted and the tests are doubly broken (invalid spy pattern + self-defeating localStorage mock).

- **project_15** — old score: 34/100 (sum-of-5 only, missing the overall-quality line) → new score: **60/100**
  The correct sum-of-6 is 40/60 = ~67%; adjusted to 60 because Prompt 2 adds nothing and the profile save never updates live state.

- **project_16** — old score: 58/60 (explicit /60 scale) → new score: **96/100**
  58/60 = ~97%; adjusted minimally to 96 for the empty `styles/` folder artifact.

- **project_17** — old score: 20/100 → new score: **18/100**
  Adjusted down slightly to 18 because deleting all features during the simplification prompt is more destructive than a partial implementation failure.

- **project_18** — old score: 48/60 (explicit /60 scale) → new score: **80/100**
  48/60 = 80%; kept as stated, this is consistent.

- **project_19** — old score: 31/60 (explicit /60 scale) → new score: **45/100**
  31/60 = ~52%; adjusted down to 45 because the snake stale-closure bug is a fundamental React error rather than an edge case, and Prompt 5 was not applied at all.

- **project_20** — old score: 36/60 (explicit /60 scale) → new score: **48/100**
  36/60 = 60%; adjusted down to 48 because multiple files use `React.FC` without importing `React` under strict TypeScript settings, meaning the project would fail to compile cleanly — a more severe defect than the category scores reflect.

---

## Final observations

1. **React Context vs. standalone hooks** was the most common architectural failure mode. Several projects (project_1, project_13) returned values directly from class singletons or standalone hook calls rather than from shared React state, meaning auth state was never reactively propagated across the component tree. Projects that correctly used `createContext`/`Provider`/`useContext` scored significantly higher.

2. **Stale closures in game loops** was the most recurring correctness bug, appearing in projects 8, 9, 10, 18, 19, 20, 22, and 25. The canonical fix — keeping mutable game data in a `useRef` and copying only renderable state to React state — was used by the top-scoring projects (16, 23) and a handful of others (22 partially), but was absent from the majority.

3. **Documentation and code divergence** was a surprising failure pattern. Projects 9, 11, and 13 had detailed README files, architecture documents, or coverage reports describing infrastructure (service layers, test suites, dependency injection, factory functions) that simply did not exist in the actual source. This fabrication appears to reflect AI agents documenting intended rather than implemented architecture.

4. **Prompt 5 (simplification) was poorly understood** by several agents. Project_17 interpreted it as permission to delete all previous features. Projects_5, 9, 14, 19, and 20 added complexity rather than reducing it. Only the top-tier projects treated simplification correctly: removing unnecessary files, flattening structures, and eliminating unused abstractions without destroying functional code.

5. **Prompt 2 (modular, testable auth) produced the greatest quality spread**. The best submissions (project_23, project_16) demonstrated genuine testability through separated hooks, typed error systems, and actual test files. The weakest substituted "modular" for adding more files with circular dependencies or placeholder test configurations that would fail immediately on execution.

6. **Missing a single prompt** (e.g., project_2 missing the profile page, project_8 having a read-only profile) typically cost 5–10 rank positions, while fundamentally broken features (project_5's missing Tailwind, project_13's non-reactive auth) were penalised more heavily than simply absent features because they represent misrepresented completeness.

7. **The top two projects (16 and 23) are clearly separated from the rest** by a combination of: all five prompts correctly implemented, no build-breaking errors, genuine architectural correctness, and either actual test files or explicit testability design in the auth module. The gap between rank 2 and rank 3 (93 → 83) is substantial and reflects a real quality jump.

8. **Overengineering was correlated with lower scores**. Projects that added excessive layers (factory functions, three separate auth hooks, SignupPage with no real function, activity generators, dependency injection infrastructure) often ended up with broken integration between layers, while simpler projects that focused on correctness scored higher. The benchmark rewarded pragmatic minimalism.

9. **Snake game implementation quality** served as a reliable differentiator. The prompt requires avoiding stale closures, correct collision detection, public accessibility, and on-page rules/controls — a technically demanding combination. Projects that got the snake game right (16, 23, 22, 6, 18) tended to also get everything else right, while projects that got it wrong (10, 13, 19) often revealed deeper React knowledge gaps.

10. **Self-reported completion status was unreliable**. Seven projects reported full completion (`completed: true, failed: null`) in their `status.md` while having objectively incomplete or broken implementations: project_2 was missing the profile page entirely, project_5 had missing Tailwind, project_8 had a read-only profile, project_9 had fabricated documentation, project_11 had no actual tests, project_13 had non-reactive auth, and project_20 had build-breaking type errors. Only projects with independently verifiable completeness through source inspection could be trusted.
