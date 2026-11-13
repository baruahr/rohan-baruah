# Decision — "The assistant can't find my doc"

*Worked example. All data is synthetic.*

```
Decision:      How do we bring "can't find my doc" failures back down and rebuild trust?
For:           Knowledge workers asking about today's work; seen as no-answer rate < 10% and return rate back to 58%.
Lever:         Engineering (primary) · Design (secondary, in parallel)
Evidence:      Index lag 0.8 h → 6.4 h at week 6, no-answer 9.1% → 14.4% [E3];
               43% of failures are docs too new to be indexed [E2];
               silent failures end in give-up 65–67% of the time vs 25% otherwise [E2, E1 T3].
Options:       A · Restore near-real-time indexing for recently edited docs (engineering)
               B · Show what was searched and how fresh it is when there's no answer (design)
               C · Build a notes-app connector (product)
               D · Do nothing; accept batched indexing for the cost saving
Chosen:        A, with B in parallel — confidence: high for A, medium for B
Because:       A removes the largest single cause and matches the timing of the regression.
               B is cheap and lowers the trust cost of every remaining failure, whatever its cause.
Why not:       Product — the notes-app gap is real but unsized (one interviewee, 18% of a 40-query sample);
               size it with a fake door before committing to a connector.
               Design alone — explaining a failure doesn't make the doc appear; no-answer stays at ~15%.
Trade-off:     Gives back part of the indexing cost saving that batching delivered.
Reversible:    Yes — both behind flags.
Test:          A: fast-path index docs edited in the last 24 h for 2 weeks on 20% of tenants.
               Worked if no-answer < 11% in the test group.
               B: "Searched Drive, Wiki, Tickets · updated 6 min ago" in no-answer states, 50/50 split.
               Worked if give-up after a no-answer drops by 15 points.
Revisit if:    Fast-path indexing cuts lag but no-answer stays > 12% — then ranking (H2) or coverage (H4) matters more than we think.
Next step:     Eng lead scopes the fast-path for recent edits (this sprint); designer prototypes the no-answer state; PM adds a notes-app fake door to size H4.
```

## Why this lever

The regression is technical and has a clear start date: when indexing went batched, fresh docs stopped being findable, and fresh docs are what people most want help with. That's an engineering fix. But the evidence also shows that *how* the assistant fails decides whether people come back. Users who see nothing and get no explanation give up about two and a half times as often. So design runs alongside, not after: it makes every remaining failure understandable, including the ones engineering won't fix this quarter. The notes-app connector may well be worth building, but today it rests on one interview, so product's move is to measure demand, not commit.

## The test

- **What we'll do:** ship A and B behind separate flags so their effects can be read apart; run the notes-app fake door for the same two weeks.
- **Signal it worked:** no-answer < 11% (A); give-up after no-answer down ≥ 15 points (B); return rate trending back toward 58% across both.
- **Signal it didn't:** lag falls under 1 h but no-answer barely moves — the cause was misattributed, and ranking is next to investigate.
