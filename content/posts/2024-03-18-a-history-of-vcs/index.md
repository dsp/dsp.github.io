---
title: "A History of Source Control Management Systems: Part 1"
date: 2024-03-18T10:45:49Z
draft: true
---

# A History of Source Control Management Systems
Source Control Management (SCM) Systems, have a long and rich history. As th `e systems evolved, so have their concepts, use cases and adoption over time. While SCMs are ubiquitous in modern software development, they have been fairly novel in early 90s, and arguable it took the rise of Git and Github for them to be used nearly everywhere.

I want to provide an overview of what I consider the most  important and influential systems over time. This list does not attempt to be complete. There are many systems that aren’t covered and details that I will be missing. The history of some of these systems are difficult to trace back. There is little write up on the origins of early software, and so my primary sources of many of these are Wikipedia. More recent systems such as SVN, Mercurial and Git are easier to trace and I often recall some of the details from memory.

I have used most of the systems on this list myself at some point in time. For systems that I haven’t used myself, such as SourceSafe and ClearCase, I have tried to mark them as such and would love to hear from you about your experience with them.

## Overview

The blog post is ordered chronological. The initial post, Part 1, will cover SCCS and RCS, two hugely influential version control systems of the 70s and 80s. The systems are generally local only and version single files at a time.

Part 2 (TBD) will cover the rise of centralised version control systems, such as CVS, SourceSafe, ClearCase, that allow users for the first time concurrent access to the same files from different machines.

In the third part (TBD), we will focus on the evolution of centralised version control systems and touch on SVN and Perforce, two very successful and until this day, widely used version control systems.

Part 4 (TBD) will put the spotlight on the next leap in version control systems: Decentralised version control. We will take a look at the origins of decentralised version control systems at Sun Microsystems, and their spiritual descendant Bitkeeper, and take a look at early open source systems such as has GNU Arch, Monotone and the very unique Darcs.

With the origins of decentralised version control systems behind us, we will focus in Part 5 (TBD), on the version control systems wars between 2005 to 2015, where three main systems, Git, Mercurial and Bazaar were simultaneously developed.

In the last two parts (TBD), we will take a quick look at the current landscape of version control systems, as well as some interesting ideas that are developed as part of Fossil and Pijul, before I will talk about, what I consider the mission version control system.

I would very much appreciate feedback on this series of blogposts. Please reach out to me at blog@experimentalworks.net (or respective Lobste.rs or HN threads in case they exist).

## Part 1: SCCS and RCS
### 1973: SCCS
It might come as a surprise that the first version control system was a relatively late creation in the history of computing. By the time the first version control system, SCCS was created in 1972, UNIX was already in development for three years. However, if we look back into history, it seems quite natural.

Before the late 1960s, the vast majority of programs were written on [punched cards](https://en.wikipedia.org/wiki/Punched_card). A version of a program, was the physical copy of the punched cards with the instructions of the program. Versioning a program was physical labour of organising and storing the cards in storage boxes. While terminals and disks were available, they were expensive and used for in- and output to the programs themselves, rather than developing programs. Operating systems at the time were usually running programs one-at-a-time in a [batch](https://en.wikipedia.org/wiki/Batch_processing). 

In the 1970s, [video terminals](https://en.wikipedia.org/wiki/Computer_terminal) such as the [VT100](https://en.wikipedia.org/wiki/VT100) and [time-sharing operating systems](https://en.wikipedia.org/wiki/Time-sharing), such as [UNIX](https://en.wikipedia.org/wiki/History_of_Unix) and [DEC TSS/8](https://en.wikipedia.org/wiki/OpenVMS) became cheaper and as a result more widespread. With multiple users able to work on a central time-shared computer, the computer researchers to move away from the inconvenience of punched chards towards files on the disks. But how what is the virtual equivalent of storing and versioning boxes of punched cards?

In 1972 [Marc Rochkind](https://en.wikipedia.org/wiki/Marc_Rochkind) developed a version control system for IBM System/370 in [SNOBOL](https://en.wikipedia.org/wiki/SNOBOL). A year later, in 1973, he rewrote the program in C for UNIX: *The first version control system, **SCCS** was born*.
 
SCCSs idea was to store the deltas files and the deltas for each version of the file. For each file under SCCS control, there would be an accommodating `SCCS/s.main.c` and `SCCS/p.main.c` file that stored the deltas of the files and metadata such as comment for the change and dates. For each version the of the files the user wanted to store, they would have to explicitly tell SCCS when to create a new delta. A simple `sccs-delta <file>` would be everything that is required to create a new snapshot for the given file.

This sounds familiar? In principle, it is how most version control systems work today. However, SCCS has some very notable limitations.

Firstly, it is *local-only*, meaning that SCCS does not include any way to exchange deltas between users. In the era of few, large, time-shared machines, this was not needed. Developers would have an account on a central machine (e.g a PDP-11) and mostly developed software independently or just pointed colleagues to their respective work folders.

Secondly, SCCS was *single-file* only [^2]. SCCS tracks changes for one file at a time. Concepts such a repository of tracked files or atomic commits across multiple files did not yet exist.

Modern terminology such as repository, commit, checkout, etc did not yet exist.

Let’s take a quick look how one would use SCCS:

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

The file format for storing deltas is one of the most fascinating bits of SCCS.

SCCS stores history in plain text using [Interleaved Deltas](https://en.wikipedia.org/wiki/Interleaved_deltas) (or weaves). Changed lines and their information are stored directly be next to original and retrieved in a forward merge of deltas. The deltas are **weaved** into the file. For example, let’s take a file

```
foo
bar
```

And modify it to

```
bar
baz
```

In modern diff terms:

```diff
--- a/test
+++ b/test
@@ -1,2 +1,2 @@
-foo
 bar
+baz
```

The SCCS file containing the weaved deltas for this might look something along the lines of [^1]:

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

So the first line `^AI 1`, `^AD 2` means at version 1 the line was inserted and version 2 it was deleted. The line content is  foo. 

This has distinct advantages for attributing lines to changes, as well as uniform retrieval time. The disadvantage is fairly inefficient storage and as well as potentially fairly poor performance in practice, as you will have to read all revisions of a file to checkout a revision. While most SCMs later on use different storage algorithms, we will see interleaved deltas being used again in modern version control systems.

#### Implementations

The original SCCS would go on to become widely spread across UNIX systems, but its original version stayed proprietary throughout.

Eric Allman reimplemented SCCS in 1980 at the University of California Berkley. This versions made was later maintained by AT&T and Sun Microsystems before it made it’s way to [shilytools](https://codeberg.org/schilytools/schilytools/src/branch/master/sccs) where it resides today under the CDDL license. Most modern UNIX and UNIX-like distributions such as Solaris and FreeBSD, still offer this version as a package.

The GNU projects maintains a reimplementation of SCCS as [CSSC](https://www.gnu.org/software/cssc/) under the GPL.

#### Legacy

While very few people use SCCS nowadays, it influence on modern version control systems can’t be denied. Ideas such as storing deltas, adding comments to commits, specific folders for storing versions (SCCS/) and expanding version IDs during checkout will remain used in many version control systems.

### 1982: RCS
SCCS was the sole version control system for the first nine years after its creation. In 1982, [Walter Tichy](https://en.wikipedia.org/wiki/Walter_F._Tichy) developed [RCS](https://en.wikipedia.org/wiki/Revision_Control_System) at the Purdue University. It’s design was published as a paper [“Design, Implementation, and Evolution of a Revision Control System”](https://dl.acm.org/doi/10.5555/800254.807748) in the Proceedings of the 6th International Conference on Software Engineering (ICSE’82).

In many ways it is similar to SCCS. It operates on one file at a time, with similar limitations. However, it had one trick up his sleeves: **Reversed Deltas**.

#### Reversed Deltas

RCS stores history in **reversed, separated deltas**. 

The first difference to SCCS is that it stores **separate deltas**. Instead of interweaving the deltas into the file, the ideas is stores a full file for one revision, and deltas as generated by [`diff`](https://man7.org/linux/man-pages/man1/diff.1.html) (notable diff didn’t exist when SCCS was written) for following revisions. 

The second difference, is to store these deltas in reverse order. The last stored revision will contain the full file. Other revisions store the delta going from the next version to the current version, forming a delta-chain from the newest revision to the older revision.

This has distinct advantages. In the most common case, checking out the most recent version, RCS requires only to read the last version and stream the content directly to a file, making access much faster. When writing a new revision, RCS must only calculate the difference between the new version and the most recently stored version and overwrite the last stored version with the delta and then append the new full file. In contrast, SCCS needs to always rewrite the whole file when a new version is inserted, and needs to read the whole file if any version is retrieved. On the flip side, retrieving older versions can be slower in RCS than in SCCS, where restoring any version takes always the same time.

Let’s take a look at a RCS file. Note that all RCS files are usually stored as the filename with an appended suffix `,v`. Binary data is generally stored with each version being gzipped:

An example:
```rcs
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

#### Claimed improvements over SCCS
Tichy’s original paper from 1982 claimed a few improvements over SCCS. Firstly, the results in checkout and checking operations were much faster for the common case (e.g. most recent revision), but showed slowness checking out older revisions (as expected). Secondly, it claimed that the UX of SCCS at the time, where one has to operate on the version files, rather than the checked out files (e.g. `sccs delta s.main.c`), was a common pitfall. Hence RCS supported specifying either the checked out file or the version file. Thirdly, RCS improved on the lock mechanism employed by both SCCS and RCS to ensure a single writer at a time, by leaving allowing unprivileged users to overwrite a lock, while adding a paper trail (in form of sending a local email) to when a lock was broken. SCCS in contrast required privileged users to break the lock, and did not leave any paper trail. Notable, the initial version of RCS did not include checksumming, branching or tagging, which SCCS at the time already supported. Tichy felt that some of these features were unnecessary, but already foresaw that RCS will eventually gain these features (which of course it did).

> *In all fairness, we need to point out that SCCS offers
many features that are missing from RCS. For example,
SCCS performs complete checksumming, and provides
flags that control the creation of branches and the
range of revision numbers. We feel that many of these
features are unnecessary and contribute to the bulkiness of SCCS. We realize, however, that some of these
features may creep into RCS eventually.*
> 
> -- Design, Implementation, and Evolution of a Revision Control System
 
#### Example
Now let’s take a look at a common usage. We are checkout out our `main.c` from an existing RCS file. We lock it during checkout so we can write it (without, RCS would check it out read-only). We edit it and check in a new version. Lastly, we are done and unlock the file.

```
$ co -l main.c
main.c,v  -->  main.c
revision 1.1 (locked)
done
$ ci -l main.c
main.c,v  <--  main.c
new revision: 1.2; previous revision: 1.1
enter log message, terminated with single '.' or end of file:
>> update.
>> ^D
done
$ co -u main.c 
main.c,v  -->  main.c
revision 1.2 (unlocked)
writable main.c exists; remove it? [ny](n): y
done
```

### Legacy


[^1]: Taken from Wikipedia, https://en.wikipedia.org/wiki/Interleaved_deltas (Retrieved 18 March 2024).
[^2]: SCCS Commands from IBM AIX: https://www.ibm.com/docs/en/aix/7.2?topic=s-sccs-command