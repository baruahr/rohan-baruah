# Diagnosis — "The assistant can't find my doc"

*Worked example. All data is synthetic.*

## What the evidence says

1. **Failures jumped when indexing changed.** No-answer rate averaged 9.1% in weeks 1–5 and 14.4% in weeks 6–10. Median index lag went from 0.8 h to 6.4 h in the same week batched indexing shipped. [E3 wk 1–10]
2. **The biggest single cause is docs too new to be indexed.** 17 of 40 failed queries (43%) were for docs that existed but weren't indexed yet. All of them were under 20 hours old. [E2]
3. **Unconnected sources are second.** 9 of 40 (23%) were in sources the assistant can't search. 7 of those 9 were the notes app. [E2]
4. **Ranking and user error are smaller.** 8 of 40 (20%) were indexed but not surfaced; 6 of 40 (15%) were docs that don't exist as described. [E2]
5. **Silent failures make people quit.** 22 of 40 users gave up after the failure. The give-up rate was 65% (11/17) for not-yet-indexed docs and 67% (6/9) for unconnected sources, against 25% (2/8) for ranking misses, where users saw *something* and rephrased. [E2]
6. **Users can't tell why it failed, and stop trusting it.** 4 of 6 said "nothing found" gave them no way to know whether it looked [E1 T3]; 3 of 6 described missing same-day docs [E1 T2]. Return rate fell from 58% to 51%. [E3]

*Say and do agree:* users describe fresh docs missing (E1 T2), and the labelled sample shows it's the largest cause (E2).

## Hypotheses by lever

### Engineering

**H1 · Batched indexing made fresh docs unfindable** — confidence: **high**
- If true, we'd see: failures rise at week 6; misses cluster on docs < 1 day old.
- For: lag 0.8 h → 6.4 h at week 6 and no-answer up 5.4 points at the same time [E3]; 43% of failures are unindexed docs, all < 20 h old [E2]; P2 "something changed about a month ago", P4 "it's the stuff from today it misses" [E1].
- Against: no labelled sample from before week 6, so we can't prove these failures were rarer then [E2 caveat].
- Share explained: ~43% of failures. At a 14–15% no-answer rate that's ~6 points — about the size of the week-6 rise.

**H2 · Ranking surfaces the wrong doc** — confidence: **medium**
- For: 20% of failures [E2]; P5 got an older version [E1 T5].
- Against: small share; users mostly recover by rephrasing (5/8) [E2]. Likely present before week 6.
- Share explained: ~20%, with lower impact on trust.

### Design

**H3 · Failures are silent, so users blame the assistant and leave** — confidence: **medium-high**
- If true, we'd see: higher give-up when users get no clue about what was searched; trust complaints that don't depend on the cause.
- For: give-up 65–67% for silent failures vs 25% when something came back [E2]; 4 of 6 couldn't tell why it failed [E1 T3]; 2 of 6 assumed it searches everything [E1 T1].
- Against: transparency explains the failure but doesn't make the doc appear; on its own it won't move the no-answer rate.
- Share explained: doesn't cause failures, but shapes what each failure costs in trust — across all four causes.

### Product

**H4 · The notes app is a coverage gap worth closing** — confidence: **low-medium**
- For: 7 of 40 failures (18%) [E2]; P3 keeps key work there [E1].
- Against: one interviewee; no data on how many users rely on it; a connector is a partnership and roadmap commitment, not a quick fix.
- Share explained: ~18–23%.

**H5 · Users ask for docs that don't exist** — confidence: **low**, set aside
- 6 of 40 (15%) [E2], but this is user misremembering, not a product gap. Better handled by H3 (say what was searched for and where).

## Gaps

- **No pre-week-6 failure sample.** Labelling 40 failed queries from weeks 1–5 would confirm H1's share directly.
- **Notes app demand is unknown.** Need the share of active users who have the notes app connected elsewhere in the org, or a fake-door count.
- **No per-source split in telemetry.** Would show whether the lag hits all sources equally.
