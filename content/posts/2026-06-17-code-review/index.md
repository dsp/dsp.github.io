---
title: "Conceptualizing Code Review"
date: 2026-06-17T16:53:34+01:00
draft: true
math: true
---
I always struggled with context switching between codebases when I had to review code. I opened a change in 
a repo I haven't tocuhed in weeks, and the first few minutes I was just trying to remember what the code 
did in the first place. I somewhat crawled and grepped through the codebase and looked at somewhat familiar code.
This was a bit of annoying friction at best, but at worst, it lead me to forgot key pieces that I needed for 
a thorough review.

With more and more code being AI generated, this little friction has now become a serious problem. You
simply cannot keep up anymore with reviewing the amount of code gnerated across a wide variety of repos. At 
least not with the methods we have been using thus far. 


## Review as a state transition
I  never *know* a codebase as it fullest. 

Code review is about my mental model I have about the codebase and what
changed. This is my job as a reviewer. 

I have a mental concept of the architecture and its implementation. I also
have a mental model of the idoms, runtime behaviour and best practiceses in the chosen programming langauge. The
patch I am looking is a change to that mental model, and it's my job to ensure that change is consistent with
the requirements, architecture, idioms, and so on. 

Or simply put, I have _some_ initial notion of mental model or $\text{State}^{\text{before}}$ and apply a diff or $\Delta$, leading to a new $\text{State}^{\text{after}}$:

$$
\text{State}^{\text{before}}_{\text{code}}
\;\xrightarrow{\,\Delta{\text{diff}}\,}\;
\text{State}^{\text{after}}_{\text{code}}
\tag{review}
$$
