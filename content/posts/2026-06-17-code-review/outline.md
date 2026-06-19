
---
title: "Conceptualizing Code Review"
date: 2026-06-17T16:53:34+01:00
draft: true
---

<!--
OUTLINE / SCRATCH — draft notes to rewrite from. Not prose yet.
Take: review is breaking under AI not because AI writes bad code, but because
review was always secretly a function of state we hold in our heads — and AI
is draining that state faster than we can refill it. The fix isn't writing more
by hand; it's a review tool that stops assuming you hold the model.
-->

## Opening — the friction I already felt

- Personal hook: the thing I always hated about review was *context-switching
  between codebases*. Open a PR in a repo I haven't touched in weeks, and the
  first few minutes are just trying to remember what the thing even does.
- That friction was annoying but survivable when I wrote most of the code.
- Now there's a flood of AI-generated code, and that small friction has become
  the bottleneck. The industry is noticing: AI roughly doubles PR volume while
  review time per PR climbs (~91% in one report). Writing stopped being the
  constraint; reading is.
- This pushed me to actually conceptualize what review *is*, rather than treat
  it as a chore.

## The reframe — review is a state transition

- Model it: review is the transition $state^{code}_{old} \rightarrow_{\delta} state^{code}_{new}$.
- The artifact we're handed — the diff — is the $\delta$, and it's rendered at
  one fixed altitude: lines, additions, deletions. Very low level.
- Worse: *within* that single diff, multiple altitudes are flattened together.
  A high-level conceptual change ("we moved auth out of the request path") and a
  detailed runtime change ("this now retries 3x with backoff") live in the same
  hunk, in the same green/red, with no separation.
- A diff is pure delta. It contains almost none of the state.

## The hidden dependency — you supply the state, not the diff

- Callback to my own post *Communicate State not Deltas*: I argued you should
  communicate state, because the audience doesn't carry your context — deltas
  are meaningless without the state to anchor them.
- Review is exactly this failure mode, institutionalized. We hand reviewers a
  pure delta and *expect them to supply the missing state from their own heads.*
- So the real input to review was never the diff. It was: diff + the reviewer's
  mental model of $state^{code}_{old}$. The better that model, the better the review.
- We always knew this implicitly — and we always got it a bit wrong even at our best.

## What erodes the model (pre-AI)

- Time: haven't seen the code in a while → model decays.
- Modularity: low modularity / high coupling → no clean boundary to hold a
  partial model; you need the whole thing.
- Size & churn: the codebase outgrows what any one person can keep resident.
- None of this is new. AI just turns the dials to 11.

## Why AI makes it strictly worse (the compounding loop)

- (a) Volume: it generates far more code, so more delta per unit time.
- (b) Modularity erodes: generated code optimizes for "works", not for a
  structure a human can hold in their head.
- (c) We accept superficially: reading-without-writing builds a much weaker
  model than writing did. Skim, approve, merge.
- The loop: write less → weaker state model → review more superficially →
  accept more code we don't really model → even weaker state. Repeat.
- Endpoint: we increasingly don't know what our own code does. Amplified the
  more we shift from writing to reading.

## The tempting wrong answer

- "Then just write more code by hand / review like it's 2019."
- I think that ship has sailed. Moralizing back to manual coding is nostalgia,
  not a plan. The volume and the economics won't reverse.
- The honest move is to assume *low initial state* as the default condition and
  design for it.

## What a review tool should be instead

- Stop assuming the reviewer arrives holding $state^{code}_{old}$. Assume they
  hold almost none of it, and have the tool reconstruct and serve it.
- Core idea: **views at different altitudes** over the same change, instead of
  one flattened diff:
  - Conceptual: what changed in plain terms? what's the intent?
  - Structural: *where* in the module/architecture map did things move?
  - Semantic: what's the actual semantic delta, refactor-aware (renames/moves
    factored out, not shown as noise)?
  - Runtime/behavioral: what's the delta in what the program *does* — control
    flow, side effects, perf, failure modes?
- Let the reviewer move up and down the altitude ladder at will, and re-anchor
  to the prior state on demand instead of carrying it in their head.
- The new enabler: generative AI is exactly the thing that can synthesize these
  altitudes on the fly — the same technology creating the problem can build the
  microscope for it. This wasn't feasible before.

## Close

- I'm not building this (yet). I hope someone is.
- Caveat / honesty: open question whether AI-built explanations are trustworthy
  enough to *be* the state, or whether that just moves the verification problem
  up a level. Worth saying plainly rather than hand-waving.
- One-liner to land on: we spent decades optimizing how we communicate deltas.
  We never built the tool that hands you back the state.

---

<!--
PRIOR ART / RESEARCH DIRECTIONS (for me, not for the post body)

The bottleneck is real and measured:
- LogRocket — AI coding tools shift the bottleneck to review:
  https://blog.logrocket.com/ai-coding-tools-shift-bottleneck-to-review/
- Codacy — AI is breaking code review (PR volume vs review throughput):
  https://blog.codacy.com/ai-breaking-code-review-how-engineering-teams-survive-pr-bottleneck
- Swarmia — should humans still review all your code?:
  https://www.swarmia.com/blog/should-humans-still-review-code/

"Diff is only a low-level view" — semantic / AST / refactor-aware diffing
(prior art for the altitude idea):
- difftastic + SemanticDiff (tree-sitter / AST diffs, hide noise, detect moves):
  https://semanticdiff.com/
- AST diffing benchmark / refactoring-aware diff (arXiv 2403.05939):
  https://arxiv.org/pdf/2403.05939
- RAID — refactoring-aware code review tooling (arXiv 2103.11453):
  https://arxiv.org/pdf/2103.11453
- Semantic slicing of architectural-change commits (arXiv 2109.00659):
  https://arxiv.org/pdf/2109.00659

Review-as-comprehension / mental-model research (backs the "you supply the state"
claim — reviewers build a mental model, takes ~1yr to be effective in a new
codebase, scoping-down is the coping strategy):
- Code Review Comprehension via comprehension theories (arXiv 2503.21455):
  https://arxiv.org/abs/2503.21455
- Code Review as Decision-Making — cognitive model (arXiv 2507.09637):
  https://arxiv.org/pdf/2507.09637

Threads to maybe develop: "altitude" as the organizing metaphor; the
verification-regress problem (who reviews the AI's summary of the diff?);
whether modularity-for-humans becomes an explicit design goal again.
-->
