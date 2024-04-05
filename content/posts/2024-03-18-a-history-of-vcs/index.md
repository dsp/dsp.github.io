---
title: "A History of Source Control Management Systems: Part 1"
date: 2024-03-18T10:45:49Z
draft: true
---

# A History of Source Control Management Systems
Source Control Management (SCM) Systems, have a long and rich history. As the systems evolved, so have their concepts, use cases and adoption over time. While SCMs are ubiquitous in modern software development, they have been fairly novel in the 80s and 90s, and arguable it took the rise of Git and Github for them to be used nearly everywhere.

I want to provide an overview of what I consider the most  important and influential systems over time. This list does not attempt to be complete. There are many systems that aren’t covered and details that I will be missing. The history of some of these systems are difficult to trace back. There is little write up on the origins of early software, and so my primary sources of many of these are Wikipedia. More recent systems such as SVN, Mercurial and Git are easier to find sources on and I often recall some of the details from memory.

I have used most of the systems on this list myself at some point in time. For systems that I haven’t used myself, such as SourceSafe and ClearCase, I have tried to mark them as such and would love to hear from you about your experience with them.

## Overview

The blog post is ordered chronological. The initial post, Part 1, will cover SCCS and RCS, two hugely influential version control systems of the 70s and 80s. The systems are generally local only and version single files at a time.

Part 2 (TBD) will cover the rise of centralised version control systems, such as CVS, SourceSafe, ClearCase, that allow users for the first time concurrent access to the same files from different machines.

In the third part (TBD), we will focus on the evolution of centralised version control systems and touch on SVN and Perforce, two very successful and until this day, widely used version control systems.

Part 4 (TBD) will put the spotlight on the next leap in version control systems: Decentralised version control. We will take a look at the origins of decentralised version control systems at Sun Microsystems, and their spiritual descendant Bitkeeper, and take a look at early open source systems such as has GNU Arch, Monotone and the very unique Darcs.

With the origins of decentralised version control systems behind us, we will focus in Part 5 (TBD), on the version control systems wars between 2005 to 2015, where three main systems, Git, Mercurial and Bazaar were simultaneously developed.

In the last two parts (TBD), we will take a quick look at the current landscape of version control systems, as well as some interesting ideas that are developed as part of Fossil and Pijul, before I will talk about, what I consider the mission version control system.

I would very much appreciate feedback on this series of blog posts. Please reach out to me at blog at (this domain) (or respective Lobste.rs or HN threads in case they exist).

## Part 1: SCCS and RCS
### 1973: SCCS
It might surprise you to learn that the first version control system emerged relatively late in the history of computing. UNIX had been in development for three years by the time SCCS, the first version control system, was created in 1972. However, a look back into history makes this seem quite natural.l.

Before the late 1960s, most programs were written using [punched cards](https://en.wikipedia.org/wiki/Punched_card). A program's version was its physical set of punched cards. Versioning a program involved the physical labor of organizing and storing these cards in boxes. Terminals and disks existed but were expensive, and computer engineers used them for input and output to the system rather than for development. Operating systems of the time typically ran programs one at a time ina [batch](https://en.wikipedia.org/wiki/Batch_processing). 

In the 1970s, [video terminals](https://en.wikipedia.org/wiki/Computer_terminal) like the [VT100](https://en.wikipedia.org/wiki/VT100) and [time-sharing operating systems](https://en.wikipedia.org/wiki/Time-sharing), such as [UNIX](https://en.wikipedia.org/wiki/History_of_Unix) and [DEC TSS/8](https://en.wikipedia.org/wiki/OpenVMS)  became cheaper and more widespread. As multiple users began working on a central, time-shared computer, researchers moved from punched cards to files on disks. But this posed a new question: How do you version these files? What is the digital equivalent of organizing punched cards?

#### The creation of SCCS

In 1972 [Marc Rochkind](https://en.wikipedia.org/wiki/Marc_Rochkind) developed a version control system for IBM System/370 in [SNOBOL](https://en.wikipedia.org/wiki/SNOBOL). He rewrote it in C for UNIX a year later in 1973: *Thus, the first version control system, SCCS, was born.*
 
SCCS could manage multiple versions of a file. Unlike modern source control systems, it lacked concepts like a repository or tracked files. Users operated on single files at a time. In early versions, they had to instruct the system to create storage files (typically in an SCCS subfolder, e.g., `SCCS/p.main.c`).

To conserve disk space, SCCS stored each version's delta along with metadata like a change comment (now known as a commit message) and the change date. To store and retrieve new versions, programmers would ask SCCS to create a new `delta`, `get` a version or a combination of such as `delget`[^3].

This sounds familiar? In principle, it is how most version control systems work today. However, SCCS has some very notable limitations.

#### Limitations

Firstly, it is *local-only*, meaning that SCCS does not include any way to exchange deltas between users. In an era of large, time-shared machines, this wasn't necessary. Developers had accounts on central machines (like a [PDP-11](https://en.wikipedia.org/wiki/PDP-11)) and worked independently or simply shared work folders with colleagues.

Secondly, SCCS was *single-file* only [^2]. It tracked changes for one file at a time. Concepts like a repository of tracked files or atomic commits across multiple files didn't exist yet.

Thirdly, to ensure single-writer access, SCCS used locking. A file under SCCS control was read-only on the disk until a user retrieved it for editing. If another user had the file checked out, SCCS would abort the operation. If no other user currently marked the file for editing, the file would become writable on disk and the user could modify it.

Since SCCS was a tool by and for computer researchers, commands referred directly to delta-editing. For example, to create a new commit, one used `sccs delta`. Modern terms like repository, commit, and checkout didn't exist then.

#### A quick example
Let’s take a quick look how one would use SCCS:

```sh
$ mkdir SCCS # Create the file in SCCS
$ sccs create main.c # Get the file and mark it for edit
$ sccs get -e main.c # Checking the delta
$ sccs delta main.c
comments? ...
```

#### Storage

The file format for storing deltas is one of the most fascinating bits of SCCS.

It uses[Interleaved Deltas](https://en.wikipedia.org/wiki/Interleaved_deltas) (or weaves), storing changed lines and their information next to the original lines in plain text.  The deltas are **weaved** into the file. For example, let’s take a file

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

So the first line `^AI 1`, `^AD 2` means at version 1 the line was inserted and version 2 it was deleted. The line content is  `foo`. 

This has distinct advantages for attributing lines to changes, as well as uniform retrieval time for any revision. The disadvantage is fairly inefficient storage and as well as potentially fairly poor performance in practice, as you will have to read all revisions of a file to checkout a revision. While most SCMs later on use different storage algorithms, we will see interleaved deltas being used again in modern version control systems.

#### Implementations

The original SCCS would go on to become widely spread across UNIX systems, but its original version stayed proprietary throughout.

Eric Allman reimplemented SCCS in 1980 at the University of California Berkley. This versions made was later maintained by AT&T and Sun Microsystems before it made it’s way to [shilytools](https://codeberg.org/schilytools/schilytools/src/branch/master/sccs) where it resides today under the CDDL license. Most modern UNIX and UNIX-like distributions such as Solaris and FreeBSD, still offer this version as a package.

The GNU projects maintains a reimplementation of SCCS as [CSSC](https://www.gnu.org/software/cssc/) under the GPL.

#### Legacy

While very few people use SCCS nowadays, it influence on modern version control systems can’t be denied. Ideas such as storing deltas, adding comments to commits, specific folders for storing versions (SCCS/) and expanding version IDs during checkout will remain used in many version control systems.

### 1982: RCS
SCCS was the sole version control system for the first nine years after its creation. In 1982, [Walter Tichy](https://en.wikipedia.org/wiki/Walter_F._Tichy) developed [RCS](https://en.wikipedia.org/wiki/Revision_Control_System) at the Purdue University. It’s design was published as a paper [“Design, Implementation, and Evolution of a Revision Control System”](https://dl.acm.org/doi/10.5555/800254.807748) in the Proceedings of the 6th International Conference on Software Engineering (ICSE’82).

In many ways it is similar to SCCS. It operates on one file at a time, with [similar limitations](#Limitations). However, it had one trick up his sleeves: **Reversed Deltas**.

#### Reversed, Separated Deltas

The first difference of RCS to SCCS, is that RCS stored **separate deltas**. Instead of interweaving the deltas into the file like SCCS did, RCS would store the full file for one revision, and deltas as generated by [`diff`](https://man7.org/linux/man-pages/man1/diff.1.html) (notable diff didn’t exist when SCCS was written) for following revisions. 

The second difference, was to store **deltas in reverse order**. The most recent stored revision consists of the full file format. Other revisions store the delta going from the next version to the current version, forming a delta-chain from the newest revision to the older revision.

This has distinct advantages. In the most common case, of checking out the most recent version, RCS requires only to read the last version and stream the content directly to a file, making checkout much faster. When writing a new revision, RCS must only calculate the difference between the new version and the most recently stored version and overwrite the last stored version with the delta and then append the new full file. In contrast, SCCS needs to always rewrite the whole file when a new version is inserted, and needs to read the whole file if any version is retrieved. On the flip side, retrieving older versions can be slower in RCS than in SCCS, where restoring any version takes always the same time.

#### Implementations
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
Tichy’s original paper from 1982 claimed a few improvements over SCCS. 

Firstly, the results in checkout and checking operations were much faster for the common case (e.g. most recent revision), but showed slowness checking out older revisions (as expected). Secondly, it claimed that the UX of SCCS at the time, where one has to operate on the version files, rather than the checked out files (e.g. `sccs delta s.main.c`), was a common pitfall. Hence RCS supported specifying either the checked out file or the version file. Thirdly, RCS improved on the lock mechanism employed by both SCCS and RCS to ensure a single writer at a time, by leaving allowing unprivileged users to overwrite a lock, while adding a paper trail (in form of sending a local email) to when a lock was broken. SCCS in contrast required privileged users to break the lock, and did not leave any paper trail. Notable, the initial version of RCS did not include checksumming, branching or tagging, which SCCS at the time already supported. Tichy felt that some of these features were unnecessary, but already foresaw that RCS will eventually gain these features (which of course it did).

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

#### Implementations
The original implementation of RCS was distributed as 4.3 BSD but the license [prohibited redistribution without written permission from Tichy](https://en.wikipedia.org/wiki/Revision_Control_System#cite_note-11). [4.3BSD-Reno](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution#4.3BSD) would contain RCS with a permissive license, BSD like license.  

In the running up to RCS 4.3, Tichy moved the project to GNU, changing the license to GPL [^3].

The [first commit](https://git.savannah.gnu.org/cgit/rcs.git/commit/?h=p&id=2a07671f9ce40cfab440c40c465357945f06aef2) from November 18th, 1989 reads:

> Import RCS 4.3 from <ftp://ftp.cs.purdue.edu/pub/RCS/>

RCS, hence, tracks it history all the way back. RCS was actively maintained by [Thien-Thi Nguyen](https://lists.gnu.org/archive/html/emacs-devel/2023-09/msg00713.html), until his death in October 2022. The project seems unmaintained at the moment.

#### Legacy
I think it is fair to say that RCS is one of the most influential source control systems to this day. Systems like CVS and Perforce use RCS file formats to this day. Terminology such as commit, checkout, log are common source control terminology. Most modern source control system such as Git or Mercurial will use similar separated-delta techniques.

### Conclusion

I hope you enjoyed this little overview of SCCS and RCS. In the next blog post we will take a look at the 1990s where the first centralized source control systems appear. They will allow multiple users to work on source code in concurrently and exchange commits via the network.

If you have corrections, suggestions or just want to say thanks, please send a mail to blog at (this domain). Feel free to submit the post to HN, Lobste.rs or Reddit.

[^1]: Taken from Wikipedia, https://en.wikipedia.org/wiki/Interleaved_deltas (Retrieved 18 March 2024).
[^2]: SCCS Commands from IBM AIX: https://www.ibm.com/docs/en/aix/7.2?topic=s-sccs-command
[^3]: Notable, the GPL was released on February 1st, 1989, just 9 months before Tichy applied it to RCS.