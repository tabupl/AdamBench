Reviews were done in batches of 5 to avoid context rot of reviewers and keep them with some context between projects.
At the start of each batch the reviewer received this prompt:

```
You are acting as a strict and careful reviewer for a benchmark of AI coding agents.

You will review benchmark submissions project by project in this session.

Important constraints:

- Review only the project folder I explicitly indicate in each next message.

- Do not inspect other project folders unless I explicitly ask you to.

- Do not compare projects yet.

- Ignore model speed, token usage, TPS, latency, cost, and all efficiency metrics.

- Focus only on the final project quality and benchmark completion.

Repository structure:

- `prompts/` contains the 5 benchmark prompts.

- `projects/XX/` contains one benchmark submission.

- `review_outputs/GLM/` is where you should save your reviews.

Your job in Phase A:

For each project I point to, review it independently and save a markdown report.

You must follow this review procedure exactly for every project:

1. Read all 5 benchmark prompts from `prompts/`.

2. Open only the indicated project folder.

3. Read `status.md` first.

4. Extract and restate the benchmark completion status from `status.md` before making any judgment.

5. Inspect the source code deeply enough to verify the project, not just its file tree.

6. Never conclude that a project is broken, incomplete, or successful based only on folder listing, node_modules, dist, or other generated artifacts.

7. The presence of `node_modules/` or `dist/` is a repository hygiene issue, not proof that the project is broken.

8. You must inspect at least these areas when they exist:

   - status file

   - main app entry / main router

   - authentication module/context/service

   - profile page / profile editing logic

   - snake page / snake game implementation

   - any layout or route protection logic relevant to the benchmark

9. If a required feature is missing, explicitly say so.

10. If the benchmark failed before later prompts, do not pretend later prompts were completed.

11. Do not use other project folders as reference.

12. Be strict, but do not hallucinate missing or present features.

Minimum evidence requirement:

Before scoring, you must produce an inspection log listing which files you actually read.

For each project review, save the result to:

`review_outputs/GLM/project_XX.md`

Scoring rubric:

Score each category from 1 to 10.

A. Task completion

- How well does the final project satisfy the 5 benchmark prompts?

- If incomplete, score according to how far it got.

B. Correctness

- Are the implemented features logically and technically correct?

C. Code quality

- Is the code readable, coherent, and reasonably well organized?

D. Architecture / maintainability

- Is the structure modular and maintainable?

- Did the refactor improve the design?

- Does the final state look easy to continue working on?

E. Simplicity vs overengineering

- Does the project avoid unnecessary complexity without becoming too bare or incomplete?

F. Overall project quality

- Overall quality of the final benchmark submission.

Output format for each review file:

# project_XX review

## Benchmark status

- Completed: yes/no

- Failed step: ...

- Status summary: ...

## Inspection log

- file/path/1

- file/path/2

- file/path/3

- ...

## Scores

- Task completion: X/10

- Correctness: X/10

- Code quality: X/10

- Architecture / maintainability: X/10

- Simplicity vs overengineering: X/10

- Overall project quality: X/10

## Summary

2-4 sentences summarizing the project.

## Strengths

- ...

- ...

## Weaknesses

- ...

- ...

## Final verdict

Overall score: X/100

2-4 sentences justifying the final score.

Important reminders:

- Do not score based only on the directory tree.

- Do not confuse repository hygiene issues with functional failure.

- Always anchor your judgment in `status.md` plus source code inspection.

- If you are uncertain whether a feature exists, inspect more files before scoring.

- Save the review file after finishing each project.



confirm that you understand
```


And after confirmation the reviewer received this prompt. After finishing a review of one project, this prompt was sent again, until 5 projects were reviewed and then the new session with reviewer was started:

```
Now review `projects/23`.

Remember:

- inspect only this project

- read `status.md` first

- inspect the required source files deeply enough to verify the benchmark tasks

- do not rely only on file tree listing

- save the review to `review_outputs/GLM/project_23.md`
```




After a reviewer performed all 25 reviews (across 5 sessions) a new session was started where reviewer was supposed to synthesize it's reviews. With this prompt:

```
You are acting as a synthesis reviewer for a benchmark of AI coding agents.

Context:

In a previous phase, benchmark submissions were reviewed individually and the review results were saved as markdown files in:

`review_outputs/GPT/`

Each file `project_XX.md` contains a structured review of one benchmark submission, including:

- benchmark completion status

- inspection log

- category scores

- summary

- strengths

- weaknesses

- final overall score

Your task now is NOT to review the original code again from scratch.

Your task is to synthesize the existing project-level review files into one consistent final ranking and summary.

Important constraints:

- Use primarily the review files in `review_outputs/GPT/`.

- Do not inspect the original project folders again unless absolutely necessary.

- Do not use any speed, TPS, token usage, cost, or efficiency metrics.

- Do not speculate about which model created which project.

- Focus only on quality of implementation, correctness, task completion, maintainability, and simplicity vs overengineering.

- Be strict and internally consistent.

Your task:

1. Read all review files from `review_outputs/GPT/`.

2. Compare them against each other.

3. Produce:

   - a full ranking from best to worst

   - a tier list

   - a short explanation for the top 5 projects

   - a short explanation for the bottom 5 projects

4. Check whether any of your earlier project-level scores seem inconsistent when viewed against the full set.

5. If needed, propose small score adjustments for consistency. You may re-order projects even if their original overall scores are close, as long as the final ranking is justified by the full set of reviews.

Write the result to:

`review_outputs/GPT/final_ranking.md`

Use exactly this output structure:

# Final ranking

## Method

Briefly explain in 3-5 sentences how you synthesized the individual reviews into a final ranking.

## Ranking

1. project_XX — score: X/100

2. project_YY — score: X/100

3. project_ZZ — score: X/100

...

## Tier list

### S tier

- project_...

- project_...

### A tier

- project_...

- project_...

### B tier

- project_...

- project_...

### C tier

- project_...

- project_...

### D tier

- project_...

- project_...

## Top 5 projects

For each of the top 5 projects:

- project name

- 2-4 sentences explaining why it ranked highly

## Bottom 5 projects

For each of the bottom 5 projects:

- project name

- 2-4 sentences explaining why it ranked poorly

## Consistency adjustments

If no changes are needed, write:

- None

Otherwise, for each adjusted project write:

- project name

- old overall score

- new overall score

- short reason for adjustment

## Final observations

Write 5-10 sentences describing notable patterns across the reviewed projects.

Examples:

- recurring strengths

- recurring weaknesses

- common overengineering patterns

- common failure modes

- what separated the best projects from the rest

Important:

- Base the synthesis on the review files, not on assumptions.

- Do not use external information.

- Do not include speed or token-efficiency considerations.

- Keep the ranking grounded in code/project quality only.
```