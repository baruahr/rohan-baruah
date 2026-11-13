# Deep mode

One problem at a time, backed by evidence, kept in a folder anyone in the triad can open. Git is optional; a plain folder works, and it can become a shared repo later.

## Workspace

Use an existing `problems/` folder if there is one in the working directory or the person names one; otherwise create it there.

```
problems/
  ledger.md                  ← one row per problem, updated as each one moves
  <problem-slug>/
    problem.md               ← stage 1
    evidence/
      README.md              ← index of every source, with an ID
      …                      ← any files: notes, transcripts, CSVs, screenshots
    diagnosis.md             ← stage 3
    decision.md              ← stage 4
    outcome.md               ← stage 5
```

The person may name a stage directly ("frame", "diagnose", "decide", "close"), or just describe where they are. Pick up from the latest file and its `status`. Each stage ends by saying what's next and what it needs.

## Stage 1 · Frame → `problem.md`

Ask only what you need: who is affected, what they are trying to do, what is going wrong, how we'd know it's fixed, and who in the triad owns the decision. Don't propose solutions yet.

```markdown
---
status: framing          # framing | gathering | diagnosed | decided | testing | closed
owner: <name or role>
opened: <YYYY-MM-DD>
---
# <Problem in the user's words>

**Who:** <the user, specifically>
**Trying to:** <the job they're doing>
**Going wrong:** <the symptom, observed — not a cause>
**Value if fixed:** <what changes for the user, observably>
**Success signal:** <metric or behaviour, with today's baseline if known>
**Stakes:** <cost of being wrong; reversible or not>
**Out of scope:** <what we are not deciding here>
```

## Stage 2 · Gather → `evidence/`

Accept anything: interview notes, quotes, support tickets, survey exports, telemetry, logs, screenshots, prior research. The person can drop files in or paste them; save pasted material as a file.

Keep `evidence/README.md` as the index, one row per source:

| ID | File | Type | What it is | n / period | Caveats |
|---|---|---|---|---|---|

Before diagnosing, check coverage: is there at least one *say* source (qual) and one *do* source (behavioural)? If not, say what's missing and whether to proceed anyway.

## Stage 3 · Diagnose → `diagnosis.md`

Read every source. For CSVs, compute rather than estimate; run code if you can. Then:

```markdown
# Diagnosis — <problem>

## What the evidence says
<4–6 findings, each with a citation. Separate what users say from what they do.>

## Hypotheses by lever
### Product
**H1 · <hypothesis>** — confidence: low | medium | high
- If true, we'd see: …
- For: … [source]
- Against: … [source]
- Share of the problem it explains: <estimate, with basis>
### Design
…
### Engineering
…

## Gaps
<What we can't tell yet, and the evidence that would settle it.>
```

Every lever gets at least one hypothesis. Rule one out with evidence, not silence. Where hypotheses overlap, say so.

## Stage 4 · Decide → `decision.md`

Run moves 4–7 of *How to engage*, then write the full decision record from SKILL.md, followed by:

```markdown
## Why this lever
<A short paragraph a PM, designer and engineer would each accept.>

## The test
- **What we'll do:** …
- **Signal it worked:** <metric, threshold, by when>
- **Signal it didn't:** …
```

Set `status: decided` in `problem.md` and add or update the row in `ledger.md`.

## Stage 5 · Close → `outcome.md`

When results are in: what happened against the success signal, whether the hypothesis held, and what we'd do differently. Be honest about partial results.

```markdown
# Outcome — <problem>
**Result:** worked | partly | didn't | inconclusive
**Signal:** <baseline → result>
**Hypothesis held?** <yes / no / partly, and why>
**Lesson:** <one line, about the lever choice>
```

Set `status: closed` and update the ledger.

## `ledger.md`

```markdown
# Decision ledger

| Opened | Problem | Lever | Confidence | Test | Status | Result | Lesson |
|---|---|---|---|---|---|---|---|
```

Once five or more problems are closed, add a short **Patterns** section under the table: hit rate by lever, and whether the team reaches for one lever first. Re-check it each time a problem closes. That pattern is how the triad gets better at choosing.
