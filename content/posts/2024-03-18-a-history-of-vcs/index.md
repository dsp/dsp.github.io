---
title: "A History of Source Control Management Systems: Part 1"
date: 2024-03-18T10:45:49Z
draft: true
---

# A History of Source Control Management Systems


Source Control Management (SCM) Systems, have a long and rich history. As the systems evolved, so have their concepts, use cases and adoption over time. While SCMs are ubiquitous in modern software development, they have been fairly novel in early 90s, and arguable it took the rise of Git and Github for them to be used nearly everywhere.

I want to provide an overview of what I consider the most  important and influential systems over time. This list does not attempt to be complete. There are many systems that aren’t covered. The history of some of these systems are difficult to trace back. There is little write up on the origins of early software, and so my primary sources of many of these are Wikipedia. More recent systems such as SVN, Mercurial and Git are easier to trace and I often recall some of the details from memory.

I have used most of the systems on this list myself at some point in time. For systems that I haven’t used myself, such as SourceSafe and ClearCase, I have tried to mark them as such and would love to hear from you about your experience with them.

## Overview

The blog post is ordered chronological. The initial post, Part 1, will cover SCCS and RCS, two hugely influential version control systems of the 70s and 80s. The systems are generally local only and version single files at a time.

Part 2 will cover the rise of centralised version control systems, such as CVS, SourceSafe, ClearCase, that allow users for the first time concurrent access to the same files from different machines.

In the third part, we will focus on the evolution of centralised version control systems and touch on SVN and Perforce, two very successful and until this day, widely used version control systems.

Part 4 will put the spotlight on the next leap in version control systems: Decentralised version control. We will take a look at the origins of decentralised version control systems at Sun Microsystems, and their spiritual descendant Bitkeeper, and take a look at early open source systems such as has GNU Arch, Monotone and the very unique Darcs.

With the origins of decentralised version control systems behind us, we will focus in Part 5, on the version control systems wars between 2005 to 2015, where three main systems, Git, Mercurial and Bazaar were simultaneously developed.

In the last two parts, we will take a quick look at the current landscape of version control systems, as well as some interesting ideas that are developed as part of Fossil and Pijul, before I will talk about, what I consider the mission version control system.

I would very much appreciate feedback on this series of blogposts. Please reach out to me at blog@experimentalworks.net or on the Lobste.rs thread (and feel free to submit it to HN).

## Part 1: SCCS and RCS
### 1973: SCCS

In the early decades of computing, program were developed and stored on punchcards. Versioning programs was the physical labour of organising and storing these punchcards with programs on them. In the 1970s, terminals and keyboards became more widespread, and development slowly moved from punchcards to files on a disk. This eventually made it necessary to find a virtual equivalent of storing and organising versions of a program.

As a result, source control systems are a relatively late creation in the history of computing. UNIX was published in 1971, and developed since 1969, three years before the first version control system was developed.

In 1972 [Marc Rochkind](https://en.wikipedia.org/wiki/Marc_Rochkind) developed a version control system for IBM System/370 in [SNOBOL](https://en.wikipedia.org/wiki/SNOBOL). A year later, in 1973, he rewrote the program in C for UNIX: SCCS was born.
 
SCCS idea was to store deltas of changes alongside the files on disk. A `main.c` would have an accommodating `SCCS/s.main.c` and `SCCS/p.main.c` that stores versions of the file. The user had to explicitly tell SCCS to create a history for a given file and explicitly mark it for editing before changing files. 

In the era of few, large, time-shared machines, this system worked very well. Developers would have an account on a central machine (e.g a PDP-11) and mostly developed software independently or just pointed colleagues to their respective work folders.

In modern terms, SCCS was is a local-only, single-file source, snapshotting, control system. Concept such as a repositories, changesets, atomic commits and concurrent access would come much later. Terminology such as commits, checkouts and others did not exist yet. [^2].

#### Example

A quick example of how you would use SCCS:

```sh
$ mkdir SCCS
# Create the file in SCCS
$ sccs create main.c
# Get the file and mark it for edit
$ sccs get -e main.c
# Checking the delta
$ sccs delta main.c
comments? ...
```

#### Storage

SCCS stores history in plain text using [Interleaved Deltas](https://en.wikipedia.org/wiki/Interleaved_deltas). In this format, changes to lines are stored directly next to original line they are changing. For example, let’s take a file

```
foo
bar
```

And modify it to

```
bar
baz
```

The SCCS file for this might look something along the lines of [^1]:

```
 ^AI 1
 ^AD 2
 foo
 ^AE 2
 bar
 ^AI 2
 baz
 ^AE 2
 ^AE 1
 ```

This has distinct advantages for attributing lines to changes, as well as uniform retrieval time, at the disadvantage of inefficient storage and retrieval in most common cases. While most SCMs later on use different storage algorithms, we will see interleaved deltas being used again in modern version control systems.

#### Continue...

The original SCCS would go on to become widely spread across UNIX systems, but its original version stayed proprietary throughout.

Eric Allman reimplemented SCCS in 1980 at the University of California Berkley. This versions made was later maintained by AT&T and Sun Microsystems before it made it’s way to [shilytools](https://codeberg.org/schilytools/schilytools/src/branch/master/sccs) where it resides today under the CDDL license. Most modern UNIX and UNIX-like distributions such as Solaris and FreeBSD, still offer this version as a package.

The GNU projects maintains a reimplementation of SCCS as [CSSC](https://www.gnu.org/software/cssc/) under the GPL.

In the 1970s to 1990s, Version control was something for developers on mainframes. In the slowly starting home computing market such as ZX Spectrum or the C64, they played no role.
 
### 1982: RCS
SCCS was the sole version control system for the next nine years. In 1982, [Walter Tichy](https://en.wikipedia.org/wiki/Walter_F._Tichy) developed [RCS](https://en.wikipedia.org/wiki/Revision_Control_System) at the Purdue University.

In many ways it is similar to SCCS. It operates on one file at a time, with similar limitations. However, it had one trick up his sleeves: **Reversed Deltas**.

#### Reversed Deltas

RCS stores history in reversed deltas. Instead of storing the first version and modifications leading to the newest version (such as SCCS), RCS stores the full file as the most recent version and the deltas to previous versions. This allows for instant checkout time, as well as easy comparison of the delta to the most recent version. An example:
```
1.2
log
@Hello world.
@
text
@#include <stdio.h>

int main() {
    printf("hello world\n");
    return 0;
}

@


1.1
log
@Initial revision
@
text
@d1 1
d4 1
@
```

RCS
## The Dark Age: CVS, Visual SourceSafe, ClearCase

## The Renewers of the Middle Ages: SVN, Perforce
## The Enlightenment Era: BitKeeper, Monotone, Arch, Darcs
## The Modern Era: Bazaar, Mercurial, Git
## The Post-War Era: Git, Fossil, Pijul
## The Future: The missing version control system

[^1]: Taken from Wikipedia, https://en.wikipedia.org/wiki/Interleaved_deltas (Retrieved 18 March 2024).
[^2]: SCCS Commands from IBM AIX: https://www.ibm.com/docs/en/aix/7.2?topic=s-sccs-command