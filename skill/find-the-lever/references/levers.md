# The three levers

Use this when diagnosing. For each hypothesis, ask which lever it belongs to, what evidence would show it, and what the cheapest test is.

## Product — *whether* and *what*

**Changes:** scope, who it's for, packaging and pricing, policy and permissions, defaults, partnerships and integrations, sequencing, saying no.

**Signatures in evidence**
- Users want something the product doesn't do or doesn't cover ("it doesn't work with X").
- The value lands for one segment and not another; the wrong people were targeted.
- Users understand it and it works, but they still don't come back — the job isn't worth doing here.
- Admin, policy or pricing gates sit between the user and the value.

**Cheapest tests:** fake door or waitlist, a scope change behind a flag, a pricing or packaging page test, talking to five users in the segment you'd add or drop.

## Design — *how it is understood*

**Changes:** mental model, flow, information architecture, feedback and system status, error and empty states, trust signals, recovery, onboarding, copy.

**Signatures in evidence**
- Users describe the product in a way that doesn't match how it works.
- The capability exists and works, but people don't find it, misuse it or give up early.
- Failures are silent: users can't tell "it failed" from "it didn't try".
- Behaviour differs sharply between users who were shown how and those who weren't.

**Cheapest tests:** a clickable prototype with five users, a copy or empty-state change behind a flag, a first-click or comprehension test.

## Engineering — *what is possible, and how well*

**Changes:** latency, reliability, freshness, quality of results or models, data coverage, scale, new capability.

**Signatures in evidence**
- Users do the right thing and the system gets it wrong.
- A metric moved after a technical change (a deploy, a pipeline change, a model swap).
- Problems cluster by load, data age, data size, device or region.
- Quality complaints persist even among expert users.

**Cheapest tests:** a log or telemetry query, a labelled sample of failures (20–50 is often enough), a time-boxed spike, a canary or A/B of the change.

## Pulling the wrong lever — common traps

| Trap | Looks like | Ask |
|---|---|---|
| Design covering for engineering | A nicer spinner on a slow system; better error copy on a broken result | Would the problem disappear if the system simply worked? |
| Engineering covering for design | Improving model quality when users don't know the feature exists | Do users who *find* it succeed? |
| Product covering for design | Cutting a feature that was only undiscoverable | What did the users who found it do? |
| Product covering for engineering | Narrowing scope to dodge a reliability problem that will return | Is this a choice, or a retreat? |
| Design covering for product | Polishing onboarding for a job users don't need done | Do users who complete onboarding come back? |
| Engineering covering for product | Making a low-value flow faster | If it were instant, would usage change? |

## When it's two levers

Common pairings: an engineering fix plus a design change that makes the fix *visible* (status, freshness, coverage); a product scope change plus design that explains the new boundary. Name the primary lever by which one moves the user outcome most, then sequence the other.
