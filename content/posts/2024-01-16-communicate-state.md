---
title: "Communicate State"
date: 2024-01-16T14:37:20+00:00
tags: ["communication", "essay"]
author: "dsp"
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: ""
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
---

A few years back, I was invited to a set executive reviews of various
infrastructure projects, both as presenter as well as reviewer. Two
of those reviews stuck in my mind, one for the clarity of the
presentation, and one for, well the lack of. I learned from both a
great deal of **contextual communication** and what I call *Communicate
State not Deltas*, and later implemented these learnings into my
own communication.

In the post I'll give a quick example of communicating updates and
communicating states and how the latter one is in most cases more
desirable.

# The tale of two teams

The first review was run by a fairly newly put together team that
wasn't exposed to reviews much before. They had a long standing
problem with reliability in a critical service. The service would
continuously fail, requiring the team to focus purely on fixing,
rather than developing new features, and most importantly, slowly
burn out the team over an unreasonable amount of oncall stress. As
a result, leadership put a lot of focus on the teams service,
offering help, engineering time and would ask for quarterly reviews.

I was invited to what was likely the second or third review the
team has done. The room would slowly fill up with a hand-full of
senior leadership, both engineers and managers, as well as two
representatives of the team. As the leading engineer started the
presentation with an update of what they have done: "We implemented
a monitoring service [...], we implemented exponential backoff,
[...]", and so on and so forth. They presented a plan for the next
quarter and the specific projects. "We will add an improve failure
rate metric and improve it by 5%.". By the end of the presentation,
people noded, but surprisingly there were little questions and
little to no meaningful discussions. The team was quickly dismissed
and the leadership team went onto the next review.

A few month later, I was invited to another review about a new team
to be build. The usual group of leadership would gather in the room,
after the lunch break to start the afternoon session of reviews.
The new team was represented by a senior engineer, who had been at the
company for a while, and had seen and presented their own fair of reviews.

The lead of the team started the discussion by giving an overview
of the problem area he was tackling.  They went on to discuss the
current state of affairs in that particular infrastructure area
that the new team was focused on, The engineer talked through why
the area is of interest, what the current technology solves, what
are the shortcomings and how it relates to the goals of the
infrastructure organisation.  They  moved on to an overview of one
and then two year goals. They finished with an outline of the plans and
potential options. As the engineer finished the presentation, an engaged
debate started amongs the senior managers and engineers
in the room. "What other aspects of the area have we not invested
yet?" "What options do we have to achieve this?" The discussion went on
for quite a long time, and had to be stopped as the review was already way behind
schedule.

I was stunned. This was a new time and the effort seemed valuable,
but it felt less pressing than the review a few weeks ago with
critical components being at risk. Yet the discussion was significantly
productive.

I prodded a bit on this before realising this was a matter of
communication style.

## Communicate State not Deltas
### Deltas
The first team communicated updates - the delta since the last
review. They showed the steps they are taking and the merits of
each project they planned. But they missed a crucial part. What
they failed understand the perspective of their audience. The other
people in the room besides them, see this team every three month.
They don't remember what has been said last time. They forgot the
details of what was spoken minutes after the review.

Sadly, talking about what we have changed, about the delta, is our
default communication style. This is how we think about our own
work, how we talk to our partners, to our teammembers, and generally
the people we communicate daily with.  For us this is the most
efficient way. We keep the full state in our head.

Others don't have that state. They don't remember every detail of
what you or yor team has done. The details of the changes the team
is communicating are meaningless without the context of where you
started and where you ended up with. They are meaningless without
the **state**.

### State
The second team communicated a state of the project. Where are they
currently? Where do we want to be in 1-2 years? What are our options
and what is the general plan? Communicating the state, allows people
to understand the full picture. They do not have to fill in the
gaps or search in their memory of what was said months ago.  They
can take a holistic view and communicate their perspective and
opinion within that context.  The resulting discussion is healtiher
and more meaningful.

Quickly after this experience, I changed my communication style
from discussing deltas to discussing on state. Unsurprisingly, I
found this not just easier to reason about, but also added a great
deal of clarity to my communication.

## Contextual Communication
Of course, this is a specific example within a corporate
environment (*grumbl grumbl insert rant about corporate processes*),
but I found that it generalises.

There are only few instances where communicating deltas is desirable.
Mostly, when you communicate frequently and regularly with someone.
For example, with your team, your partner, your friends, etc, If
you chat every day, everyone quickly converge to the same understanding
and have very recent memory of the current state of affairs. In
those scenarios, the deltas are way more interesting, as people
already know all the details. Only what changed matters.

I believe it is also the natural way of how we think.
We have full understanding of the state we are in. If we have think
to ourselfs what we needs to be done, we often think in incremental steps.
We don't have to update ourselves about the state.

The problem starts when we try to communicate this way with others.
The other side doesn't have the state. They are occupied with their
set of problems, their stuff and quite frankly, might not care that
much about what you have to say anyway.  In that case, communicating
the specific "state" of what you want to communicate, the future
"state" and quick overview of how you go from current to future
state, is way more desirable.

## Conclusion
I found defaulting to communicating **state** rather than **updates**,
signficantly increases the clarity of what you are trying to
communicate. It makes it easier to follow and engage.

Of coruse, there are exceptions. Communication is inherently
contextual. You will need to understand your audience, and what
they know about a specific topic.  However, understanding the
difference between communicating state and communicating deltas
made it much easier for me use the right style in a situation.
