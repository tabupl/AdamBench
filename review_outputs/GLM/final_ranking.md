# Final ranking

## Method
I read all 35 project review files from `review_outputs/GLM/` and extracted the overall scores and key findings from each. I normalized scores that were on a 60-point scale to 100-point scale for consistency. I then ranked projects by their overall scores, grouping projects with similar scores (within 2-3 points) and using the detailed findings to break ties. For tier placement, I considered both the absolute scores and the qualitative assessments from each review. I then compared projects against each other to identify any scoring inconsistencies and made small adjustments where the original scores seemed misaligned relative to the broader set.

## Ranking
1. project_35 — score: 100/100
2. project_23 — score: 95/100
3. project_25 — score: 93/100
4. project_3 — score: 90/100
5. project_16 — score: 90/100
6. project_18 — score: 90/100
7. project_30 — score: 90/100
8. project_31 — score: 90/100
9. project_34 — score: 90/100
10. project_1 — score: 88/100
11. project_27 — score: 88/100
12. project_24 — score: 87/100
13. project_22 — score: 86/100
14. project_11 — score: 83/100
15. project_13 — score: 81/100
16. project_6 — score: 80/100
17. project_12 — score: 78/100
18. project_5 — score: 76/100
19. project_2 — score: 72/100
20. project_29 — score: 72/100
21. project_15 — score: 70/100
22. project_20 — score: 70/100
23. project_8 — score: 68/100
24. project_9 — score: 65/100
25. project_4 — score: 60/100
26. project_10 — score: 60/100
27. project_19 — score: 60/100
28. project_33 — score: 45/100
29. project_14 — score: 42/100
30. project_17 — score: 40/100
31. project_26 — score: 38/100
32. project_32 — score: 30/100
33. project_21 — score: 28/100
34. project_28 — score: 20/100
35. project_7 — score: 13/100

## Tier list

### S tier
- project_35 (100/100) — Flawless submission with tests, proper modularity, and all features working correctly
- project_23 (95/100) — Excellent modular architecture with comprehensive tests and custom error types

### A tier
- project_25 (93/100) — Clean architecture, CSS modules, proper separation of concerns
- project_3 (90/100) — Strong engineering with testing infrastructure and CSS variables
- project_16 (90/100) — Clean modular auth, appropriate simplicity, good TypeScript
- project_18 (90/100) — Well-structured with polished UI and proper auth architecture
- project_30 (90/100) — Proper service layer separation, genuinely testable architecture
- project_31 (90/100) — Clean separation of concerns, well-organized structure
- project_34 (90/100) — Clean functional implementation with proper modularity

### B tier
- project_1 (88/100) — Strong submission with minor hygiene issues (empty folders, duplicated types)
- project_27 (88/100) — Good testable architecture with actual test files
- project_24 (87/100) — Solid with unsaved changes tracking and pause functionality
- project_22 (86/100) — Complete with mobile controls, good architecture
- project_11 (83/100) — Complete but with documentation drift and hygiene issues
- project_13 (81/100) — Great architecture but snake game missing rules/controls display
- project_6 (80/100) — Complete but refactor/simplification incomplete

### C tier
- project_12 (78/100) — Functional but prompt 2 (modularity) not meaningfully addressed
- project_5 (76/100) — Complete but with hacky workarounds and debug code left in
- project_2 (72/100) — Missing profile page entirely, misleading status
- project_29 (72/100) — Complete but with hacky profile update workaround
- project_15 (70/100) — Snake game excellent but auth refactor not addressed
- project_20 (70/100) — Complete but significant over-engineering in CSS
- project_8 (68/100) — Profile page not editable as required
- project_9 (65/100) — Fabricated documentation claiming non-existent features

### D tier
- project_4 (60/100) — Profile save is fake, double AuthProvider bug
- project_10 (60/100) — Snake game has coordinate bug making it unplayable
- project_19 (60/100) — Snake game has stale closure bug
- project_33 (45/100) — Profile page broken due to context property mismatches
- project_14 (42/100) — Failed at prompt 2, only completed 2 of 5 prompts
- project_17 (40/100) — Deleted all screens except snake during "simplification"
- project_26 (38/100) — Failed at prompt 2, route protection logic bugs
- project_32 (30/100) — Failed at prompt 1, no protected routes
- project_21 (28/100) — Critical runtime bug in profile page
- project_28 (20/100) — Broken state after failed simplification, empty directories
- project_7 (13/100) — Fundamentally broken with hallucinated dependencies

## Top 5 projects

### project_35 (100/100)
This project is a model submission that excels in every dimension. It includes actual test files (auth.test.tsx) that verify the authentication helper functions, proper modular architecture with the auth module separated from React concerns, a profile page that correctly persists changes, and a snake game that prevents food from spawning on the snake body. The code demonstrates mastery of React patterns (useCallback, useMemo, useRef) and proper TypeScript typing throughout.

### project_23 (95/100)
An outstanding submission that goes above and beyond with custom AuthError types, comprehensive test coverage (14 tests using Vitest and React Testing Library), and separate hooks for authentication, login, profile, and snake game logic. The session storage usage for auth tokens demonstrates security awareness. The dark theme UI is polished and consistent with responsive design.

### project_25 (93/100)
A clean, well-organized submission that uses CSS modules for scoped styling—a best practice that prevents style conflicts. The authentication logic is properly isolated in a custom hook, and the folder structure with index.ts exports demonstrates good project organization. The snake game is complete with rules and controls documented.

### project_3 (90/100)
A well-crafted submission with testing infrastructure set up (vitest, @testing-library/react), CSS variables for consistent theming, and barrel exports for clean imports. All prompts are properly completed with a maintainable codebase. The snake game uses canvas rendering for efficiency, and the profile page correctly handles name/email editing with validation.

### project_16 (90/100)
A clean submission that demonstrates good judgment in keeping complexity low while satisfying all requirements. The authentication logic is properly modular with clear interfaces and context pattern. The snake game uses creative emoji-based visuals for human-readable simplicity. The flat, understandable project structure after simplification is a strength.

## Bottom 5 projects

### project_7 (13/100)
This project is fundamentally broken with no working entry point. Files have wrong extensions (App.ts, App.tsx.ts), there are hallucinated dependencies (mockAuth referenced but never defined), invalid JavaScript syntax, and React hooks used outside components. The project appears to be generated without any verification or testing, making it completely non-functional.

### project_28 (20/100)
The agent broke the app during prompt 5 (simplification) and was unable to fix it. The current state has empty directories where authentication logic should exist, no protected routes, and a login page that merely navigates without authentication. Only the snake game remains functional. The README documents an architecture that doesn't exist in the code.

### project_21 (28/100)
The project completed prompts 1-2 with good architecture, but prompt 3 introduced a critical runtime bug where `useAuth().getCurrentUser()` is called but `getCurrentUser` doesn't exist on the hook's return value. This would crash the profile page on load. The error is basic and indicates insufficient testing before moving on.

### project_32 (30/100)
Failed at the first task—protected routes are not implemented. Users can navigate directly to `/dashboard` without authentication. The login page has no form inputs, just a single button that "logs in" without credentials. Only basic scaffolding was completed before failure.

### project_17 (40/100)
The agent catastrophically misinterpreted prompt 5 ("simplify the project structure") as permission to delete all screens except the snake game. This destroyed the authentication system, dashboard, and profile pages that were presumably implemented in earlier prompts. The final state contains only a working snake game but none of the core requirements from prompts 1-3.

## Consistency adjustments

### project_22
- Old overall score: 53/60 (normalized to 88/100)
- New overall score: 86/100
- Reason: While the submission is complete, the review mentions "placeholder name in package.json" and "unused Vite boilerplate CSS" which are minor issues. Compared to project_27 which has actual tests and scored 88/100, project_22 without tests should be slightly lower.

### project_24
- Old overall score: 53/60 (normalized to 88/100)
- New overall score: 87/100
- Reason: The review notes email changes don't persist across logins and no speed progression in snake game. Compared to project_1 (88/100) which has similar completeness but better persistence, a slight adjustment is warranted.

### project_9
- Old overall score: 67/100
- New overall score: 65/100
- Reason: The fabricated documentation claiming services that don't exist is a serious honesty issue that should carry more penalty. This is worse than project_8 (68/100) which simply missed a feature rather than lying about it.

## Final observations

The reviewed projects reveal several recurring patterns. **Common strengths** included functional React + TypeScript setups with Vite, proper use of React Context for authentication state, and snake game implementations that met the accessibility requirement (public routes). Several top projects demonstrated excellent modular architecture with proper separation of concerns.

**Recurring weaknesses** were prominent: many projects left debug console.log statements in the code, committed node_modules or dist directories, and failed to implement actual test files despite prompt 2 asking for "testable" architecture. Empty directories from scaffolding were commonly left behind, violating prompt 5's simplification goal.

**Profile editing issues** were surprisingly common—multiple projects used hacky workarounds like calling login() to update state, or showed success messages without actually persisting changes. This suggests agents struggled with the pattern of updating both context state and localStorage together.

**What separated the best from the rest** was attention to detail: actual test files (project_35, project_23, project_27), proper TypeScript interfaces, and snake games that correctly prevented food from spawning on the snake body. The bottom projects typically failed early due to fundamental bugs (hallucinated dependencies, broken routing logic) or misunderstood the simplification prompt as deletion rather than cleanup.