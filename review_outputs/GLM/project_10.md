# project_10 review

## Benchmark status
- Completed: no
- Failed step: Prompt 4 - "introduced a bug in Snake that it wasn't able to fix"
- Status summary: The status.md honestly reports that Prompt 4 failed due to a bug in the snake game. Prompts 1-3 were completed, though Prompt 1 has a minimal login implementation.

## Inspection log
- projects/10/status.md
- projects/10/my-react-app/package.json
- projects/10/my-react-app/src/main.tsx
- projects/10/my-react-app/src/App.tsx
- projects/10/my-react-app/src/App.css
- projects/10/my-react-app/src/index.css
- projects/10/my-react-app/src/context/AuthContext.tsx
- projects/10/my-react-app/src/context/AuthTypes.ts
- projects/10/my-react-app/src/services/AuthService.ts
- projects/10/my-react-app/src/components/ProtectedRoute.tsx
- projects/10/my-react-app/src/components/ErrorBoundary.tsx
- projects/10/my-react-app/src/pages/Login.tsx
- projects/10/my-react-app/src/pages/Dashboard.tsx
- projects/10/my-react-app/src/pages/Profile.tsx
- projects/10/my-react-app/src/pages/Snake.tsx
- projects/10/my-react-app/src/pages/Snake.css

## Scores
- Task completion: 5/10
- Correctness: 5/10
- Code quality: 6/10
- Architecture / maintainability: 7/10
- Simplicity vs overengineering: 7/10
- Overall project quality: 6/10

## Summary
Project 10 completed Prompts 1-3 but failed at Prompt 4 due to a coordinate system bug in the snake game. The authentication refactoring (Prompt 2) was well-executed with a clean service layer. However, the snake game has a critical bug where food collision detection uses swapped coordinates, making the game unplayable. The login page is also extremely minimal - just a button without input fields.

## Strengths
- Clean auth refactoring: AuthService extracted to separate class-based service with proper separation of concerns
- AuthTypes.ts properly defines TypeScript interfaces
- Profile page correctly implements editable name and email with form state
- Snake game is accessible without authentication as required
- Rules and controls are displayed for the snake game
- ErrorBoundary component wraps the snake game for error handling
- LocalStorage persistence for auth state

## Weaknesses
- **Critical: Snake game bug** - Food collision detection has swapped coordinates (`newHead[0] === food.x` should be `newHead[0] === food.y`). The snake and food use different coordinate conventions (snake: [row,col], food: {x,y}) causing collision to never trigger correctly.
- **Snake render bug** - `generateFood()` is called during render phase (line 178), causing side effects on every render
- **Debug code left in** - Multiple `console.log` statements remain in the snake game code
- **Minimal login** - No username/password fields, just a "Fake Login" button that auto-sets a fake user
- **Context doesn't react to service changes** - AuthContext reads state directly from service but doesn't re-render when service state changes (no state subscription mechanism)
- **Prompt 5 not attempted** - Project stopped at Prompt 4 failure

## Final verdict
Overall score: 60/100

The project demonstrates good architecture decisions for the auth refactoring and properly implemented profile editing. However, the snake game has a fundamental coordinate system bug that makes it unplayable - the collision detection compares wrong axes. The honest status.md reporting the failure is appreciated. The login implementation is too minimal for a real authentication demo. With the snake bug fixed (swapping x/y in collision check or food drawing), this would be a solid 7/10 project.