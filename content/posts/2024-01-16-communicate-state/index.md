---
title: Communicate State
date: 2024-01-16T14:37:20+00:00
tags:
  - communication
  - essay
author: dsp
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: ""
disableHLJS: false
disableShare: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
  image: cover.png
  alt: A person reading a book in a library. In front of them is a mechanical apperatus
  relative: true
categories:
  - thoughts
---

A few years back, I was invited to a set of executive reviews of
various infrastructure projects, both as a presenter and a reviewer.
Two of those reviews stuck in my mind, one for the clarity of the
presentation, and one for, well, the lack of. I learned a great
deal about **contextual communication** and what I call *Communicate
State not Deltas*, and later implemented these learnings into my
own communication.

In this post, I'll give a quick example of communicating updates
and communicating states and explain why the latter is, in most
cases, more desirable.

# The Tale of Two Teams

The first review was run by a fairly newly put together team that
hadn't been exposed to reviews much before. They had a long-standing
problem with reliability in a critical service. The service would
continuously fail, requiring the team to focus purely on fixing,
rather than developing new features, and most importantly, slowly
burning out the team over an unreasonable amount of on-call stress.
As a result, leadership put a lot of focus on the team's service,
offering help, engineering time and requesting quarterly reviews.

I was invited to what was likely the second or third review the
team had done. The room would slowly fill up with a handful of
senior leadership, both engineers and managers, as well as two
representatives of the team. The leading engineer started the
presentation with an update on what they had done: "We implemented
a monitoring service [...], we implemented exponential backoff,
[...]", and so on and so forth. They presented a plan for the next
quarter and the specific projects. "We will add and improve the
failure rate metric by 5%." By the end of the presentation, people
nodded, but surprisingly there were few questions and little to no
meaningful discussions. The team was quickly dismissed and the
leadership team moved on to the next review.

A few months later, I was invited to another review about a new
team to be built. The usual group of leadership would gather in the
room, after the lunch break, to start the afternoon session of
reviews. The new team was represented by a senior engineer, who had
been at the company for a while and had seen and presented their
fair share of reviews.

The lead of the team started the discussion by giving an overview
of the problem area he was tackling. They went on to discuss the
current state of affairs in that particular infrastructure area
that the new team was focused on. The engineer talked through why
the area is of interest, what the current technology solves, what
the shortcomings are, and how it relates to the goals of the
infrastructure organisation. They moved on to an overview of one
and two-year goals. They finished with an outline of the plans and
potential options. As the engineer finished the presentation, an
engaged debate started among the senior managers and engineers in
the room. "What other aspects of the area have we not invested in
yet?" "What options do we have to achieve this?" The discussion
went on for quite a long time and had to be stopped as the review
was already way behind schedule.

I was stunned. This was a new team and the effort seemed valuable,
but it felt less pressing than the review a few weeks ago with
critical components being at risk. Yet the discussion was significantly
productive.

I prodded a bit on this before realising it was a matter of
communication style.

## Communicate State not Deltas

### Deltas

The first team communicated updates - the delta since the last
review. They showed the steps they were taking and the merits of
each project they planned. But they missed a crucial part. What
they failed to understand was the perspective of their audience.
The other people in the room, besides them, see this team every
three months. They don't remember what was said last time. They
forget the details of what was spoken minutes after the review.

Sadly, talking about what we have changed, about the delta, is our
default communication style. This is how we think about our own
work, how we talk to our partners, to our team members, and generally
to the people we communicate with daily. For us, this is the most
efficient way. We keep the full state in our head.

Others don't have that state. They don't remember every detail of
what you or your team has done. The details of the changes the team
is communicating are meaningless without the context of where you
started and where you ended up with. They are meaningless without
the **state**.

### State

The second team communicated the state of the project. Where are
they currently? Where do we want to be in 1-2 years? What are our
options and what is the general plan? Communicating the state allows
people to understand the full picture. They do not have to fill in
the gaps or search in their memory of what was said months ago.
They can take a holistic view and communicate their perspective and
opinion within that context. The resulting discussion is healthier
and more meaningful.

Quickly after this experience, I changed my communication style
from discussing deltas to focusing on state. Unsurprisingly, I found
this not just easier to reason about but also added a great deal
of clarity to my communication.

## Contextual Communication

Of course, this is a specific example within a corporate environment
(grumble grumble insert rant about corporate processes), but I found
that it generalises.

There are only a few instances where communicating deltas is
desirable. Mostly, when you communicate frequently and regularly
with someone. For example, with your team, your partner, your
friends, etc. If you chat every day, everyone quickly converges to
the same understanding and has a very recent memory of the current
state of affairs. In those scenarios, the deltas are way more
interesting, as people already know all the details. Only what has
changed matters.

I believe it is also the natural way of how we think. We have a
full understanding of the state we are in. If we think to ourselves
what needs to be done, we often think in incremental steps. We don't
have to update ourselves about the state.

The problem starts when we try to communicate this way with others.
The other side doesn't have the state. They are occupied with their
set of problems, their stuff, and quite frankly, might not care
that much about what you have to say anyway. In that case, communicating
the specific "state" of what you want to communicate, the future
"state", and a quick overview of how you go from the current to the
future state, is way more desirable.

## Conclusion

I found that defaulting to communicating state rather than updates
significantly increases the clarity of what you are trying to
communicate. It makes it easier to follow and engage.

Of course, there are exceptions. Communication is inherently
contextual. You will need to understand your audience, and what
they know about a specific topic. However, understanding the
difference between communicating state and communicating deltas
made it much easier for me to use the right style in a situation.
