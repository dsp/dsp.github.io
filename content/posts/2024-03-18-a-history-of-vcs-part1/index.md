---
title: "A History of Source Control Systems: SCCS and RCS (Part 1)"
date: 2024-04-05T20:35:00Z
draft: false
tags:
  - history
  - vcs
author: David Soria Parra
categories:
  - essay
cover:
  image: cover.webp
  relative: true
  alt: A person organizing files and folders in front of computers
---

### Updates 
#### April 7th, 2024
 I received an email from Marc Rochkind. He recounts some details of the creation of SCCS. I attached the email at the end of the article and made corrections inside the article. Most importantly, check out Marc's [original paper](mrochkind.com/aup/talks/SCCS-Slideshow.pdf).

Thank you all for the kind comments and interesting discussion Hacker News and Lobste.rs.

*[HN Thread](https://news.ycombinator.com/item?id=39950712) and [lobste.rs thread](https://lobste.rs/s/i3eg8u/history_source_control_systems_sccs_rcs).*

# A History of Source Control Systems: SCCS and RCS
Source Control Management (SCM) Systems, have a long and rich history. As the systems evolved, so have their concepts, use cases and adoption over time. While SCMs are ubiquitous in modern software development, they have been fairly novel in the 80s and 90s, and arguable it took the rise of Git and Github for them to be used nearly everywhere.

I want to provide an overview of what I consider the most  important and influential systems over time. This list does not attempt to be complete. There are many systems that aren’t covered and details that I will be missing. The history of some of these systems are difficult to trace back. There is little write up on the origins of early software, and so my primary sources of many of these are Wikipedia. More recent systems such as SVN, Mercurial and Git are easier to find sources on and I often recall some of the details from memory.

Note that this posts focuses on source control systems, meaning systems meant for storing versions of source code. Other version control systems that focus primarily binary data will not be covered. For the purpose of this blog post, I will use the terms *source control system* and *version control system* interchangeable. I recognize that source control systems are a subcategory of version control systems.

I have used most of the systems on this list myself at some point in time. For systems that I haven’t used myself, such as SourceSafe and ClearCase, I would love to hear from you about your experience with them.

## Overview

The blog post is ordered chronological. The initial post, Part 1, will cover SCCS and RCS, two hugely influential version control systems of the 70s and 80s. The systems are generally local only and version single files at a time.

Part 2 (TBD) will cover the rise of centralised version control systems, such as CVS, SourceSafe, ClearCase, that allow users for the first time concurrent access to the same files from different machines.

In the third part (TBD), we will focus on the evolution of centralised version control systems and touch on SVN and Perforce, two very successful and until this day, widely used version control systems.

Part 4 (TBD) will put the spotlight on the next leap in version control systems: Decentralised version control. We will take a look at the origins of decentralised version control systems at Sun Microsystems, and their spiritual descendant Bitkeeper, and take a look at early open source systems such as has GNU Arch, Monotone and the very unique Darcs.

With the origins of decentralised version control systems behind us, we will focus in Part 5 (TBD), on the version control systems wars between 2005 to 2015, where three main systems, Git, Mercurial and Bazaar were simultaneously developed.

In the last two parts (TBD), we will take a quick look at the current landscape of version control systems, as well as some interesting ideas that are developed as part of Fossil and Pijul, before I will talk about, what I consider the missing version control system.

I would very much appreciate feedback on this series of blog posts. Please reach out to me at blog at (this domain), [Lobste.rs](https://lobste.rs/s/i3eg8u/history_source_control_systems_sccs_rcs) or [Hacker News](https://news.ycombinator.com/item?id=39950712).

## Part 1: SCCS and RCS
### 1973: SCCS
It might surprise you to learn that the first version control system emerged relatively late in the history of computing. UNIX had been in development for three years by the time SCCS, the first version control system, was created in 1972. However, in the context of the time, it makes sense:

Before the late 1960s, most programs were written using [punched cards](https://en.wikipedia.org/wiki/Punched_card). A program's version was its physical set of punched cards. Versioning a program involved the physical labor of organizing and storing these cards in boxes. Terminals and disks existed but were expensive. Programmers used them for input and output to the system rather than for development.

In the 1970s, [video terminals](https://en.wikipedia.org/wiki/Computer_terminal) like the [VT100](https://en.wikipedia.org/wiki/VT100) and [time-sharing operating systems](https://en.wikipedia.org/wiki/Time-sharing), such as [UNIX](https://en.wikipedia.org/wiki/History_of_Unix) and [DEC TSS/8](https://en.wikipedia.org/wiki/OpenVMS)  became cheaper and more widespread. Programmers started working on a central, time-shared computer, and moved from punched cards to files on disks. As computing became more widely available, the amount of source code written at Bell Labs and other centers of computing increased, leading to source code chaos. The question arose: How do you best organize and version source code?

#### The creation of SCCS

In 1972 [Marc Rochkind](https://en.wikipedia.org/wiki/Marc_Rochkind) developed a version control system for IBM System/370 in [SNOBOL](https://en.wikipedia.org/wiki/SNOBOL). He rewrote it in C for UNIX a year later in 1973: *Thus, the first version control system, SCCS, was born.*

Note: You can find the original paper on SCCS on Marc's website: https://mrochkind.com/aup/talks/SCCS-Slideshow.pdf
 
SCCS could manage multiple versions of a file. Unlike modern source control systems, it lacked concepts like a repository or tracked files.

The initial version of SCCS edited on-disk source files through punched card commands, adding and deleting source code lines. With the move to UNIX, SCCS now had to version files that were edited by `ed` (or later other editors). In order to achieve this, users issued a `delta` command to record the changes. SCCS stored the difference between the current version and the last stored version as a delta. In addition it stored metadata such as a comment (now known as a commit message) and the change date. To retrieve versions, programmers would ask SCCS to `get` a version [^3].

This sounds familiar? In principle, it is how most version control systems work today. However, SCCS has some very notable limitations.

#### Limitations

Firstly, it is *local-only*, meaning that SCCS does not include any way to exchange deltas between users. In an era of large, time-shared machines, this wasn't necessary. Developers had accounts on central machines (like a [PDP-11](https://en.wikipedia.org/wiki/PDP-11)) and worked independently or simply shared work folders with colleagues.

Secondly, SCCS was *single-file* only [^2]. It tracked changes for one file at a time. Concepts like a repository of tracked files or atomic commits across multiple files didn't exist yet.

Thirdly, to ensure single-writer access, SCCS used locking. A file under SCCS control was read-only on the disk until a user retrieved it for editing. If another user had the file checked out, SCCS would abort the operation. If no other user currently marked the file for editing, the file would become writable on disk and the user could modify it. Merging did not yet exist.

SCCS exposed the storage terminology such as `delta` directly to the user. For instance, to create a new version of a file, one would use the command `sccs delta`. Modern terms like repository, commit, and checkout didn't exist then.

#### A quick example
Let’s take a quick look how one would use SCCS. In the following example, we put the file `main.c` into SCCS control and retrieve it for editing. Note that we are using a more recent version of SCCS, as found in FreeBSD. Original SCCS used `get`, `delta`, command and operated on SCCS files directly. The `sccs` command with subcommands appeared much later.

```sh
$ sccs create -n main.c # create a new file
$ sccs get -e.main.c # Checkout the delta and lock the file for editing
$ ed main.c
$ sccs delta main.c
comments? ...
```

#### Storage

The file format for storing deltas is one of the most fascinating bits of SCCS.

It uses [Interleaved Deltas](https://en.wikipedia.org/wiki/Interleaved_deltas) (or weaves), storing changed lines and their information next to the original lines in plain text. Hence, the deltas are **weaved** into the file. For example, let’s take a file

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
Marc's original version for SNOBOL was only used by one department. The quickly afterwards developed UNIX version, became part of the [Programmer's Workbench PWB/UNIX](https://en.wikipedia.org/wiki/PWB/UNIX) and saw widespread adoption. However it stayed proprietary throughout. It's [source code](https://www.tuhs.org/cgi-bin/utree.pl?file=PWB1/sys/source/sccs4) of SCCS v4 for PWB/UNIX can now be found on the site of the Unix Heritage Society.

Eric Allman reimplemented SCCS in 1980 at the University of California Berkley. This versions made was later maintained by AT&T and Sun Microsystems before it made it’s way to [shilytools](https://codeberg.org/schilytools/schilytools/src/branch/master/sccs) where it resides today under the CDDL license. Most modern UNIX and UNIX-like distributions such as Solaris and FreeBSD, still offer this version as a package.

The GNU projects maintains a reimplementation of SCCS as [CSSC](https://www.gnu.org/software/cssc/) under the GPL.

#### Legacy

While very few people use SCCS nowadays, it influence on modern version control systems can’t be denied. Ideas such as storing deltas, adding comments to commits and expanding version IDs during checkout will remain used in many version control systems.

### 1982: RCS
SCCS was the sole version control system for the first nine years after its creation. In 1982, [Walter Tichy](https://en.wikipedia.org/wiki/Walter_F._Tichy) developed [RCS](https://en.wikipedia.org/wiki/Revision_Control_System) at the Purdue University. It’s design was published as a paper [“Design, Implementation, and Evolution of a Revision Control System”](https://dl.acm.org/doi/10.5555/800254.807748) in the Proceedings of the 6th International Conference on Software Engineering (ICSE’82).

In many ways it is similar to SCCS. It operates on one file at a time, with [similar limitations](#Limitations). However, it had one trick up his sleeves: **Reversed Deltas**.

#### Reversed, Separated Deltas

The first difference of RCS to SCCS, is that RCS stored **separate deltas**. Instead of interweaving the deltas into the file like SCCS did, RCS would store the full file for one revision, and deltas as generated by [`diff`](https://man7.org/linux/man-pages/man1/diff.1.html) (notable diff didn’t exist when SCCS was written) for following revisions. 

The second difference, was to store **deltas in reverse order**. The most recent stored revision consists of the full file format. Other revisions store the delta going from the next version to the current version, forming a delta-chain from the newest revision to the older revision.

Tichy claimed that this has distinct advantages. In the most common case, of checking out the most recent version, RCS requires only to read the last version and stream the content directly to a file, making checkout much faster. However, retrieving older versions of the file was slower in RCS than SCCS. When writing a new versions RCS calculated the difference between the new version and the most recently stored version and rewrite the whole RCS file. SCCS also needed to rewrite the whole file, but did not need expensive difference calculation [^5].

Let’s take a look at a RCS file. Note that all RCS files are usually stored as the filename with an appended suffix `,v`. Binary data is generally stored with each version being gzipped:

An example:
```rcs
1.2
log
@Hello world.
@
text
@#include <stdio.h>

int main(void) {
    printf("hello world\n");
    return 0;
}

@


1.1
log
@Initial revision
@
text
@d1 4
a4 1
int main() {
@
```

We can see that the most recent version `1.2` contains the full text. Version `1.1` contains the reversed delta information to go from `1.2` to `1.1`. Delta information is *line based*. The string `d1 4` means starting at line 1 delete 4 lines. `a4 1 ...`, means starting at line 4, add the following line. If we follow these commands, we get the original version[^4]:

```c
int main() {
    return 0;
}
```



#### Claimed improvements over SCCS
Tichy’s original paper from 1982 claimed a few improvements over SCCS:

Firstly, the results in checkout and checking operations were much faster for the common case (e.g. most recent revision), but showed slowness checking out older revisions (as expected). 

Secondly, it claimed that the UX of SCCS at the time, where one has to operate on the version files, rather than the checked out files (e.g. `sccs delta s.main.c`), was a common pinpoint among programmers. Hence RCS supported specifying either the checked out file or the version file. 

Thirdly, RCS improved on the lock mechanism employed by both SCCS and RCS to ensure a single writer at a time, by allowing unprivileged users to overwrite a lock, and sending a local email the the holder of the lock, when a lock was broken. SCCS in contrast required privileged users to break the lock, and did not leave any paper trail. 

Notable, the initial version of RCS did not include checksumming, branching or tagging, which SCCS at the time already supported. Tichy felt that some of these features were unnecessary, but already foresaw that RCS will eventually gain these features (which of course it did).

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
Now let’s take a look at a common usage. We checkout our `main.c` from an existing RCS file. We lock it during checkout so we can write it (without, RCS would check it out read-only). We edit it and check in a new version. Lastly, we are done and unlock the file.

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
The original implementation of RCS was distributed as 4.3 BSD but the license [prohibited redistribution without written permission from Tichy](https://en.wikipedia.org/wiki/Revision_Control_System#cite_note-11). [4.3BSD-Reno](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution#4.3BSD) would contain RCS with a permissive license, BSD like license.   In the running up to RCS 4.3, Tichy moved the project to GNU, changing the license to GPL [^3].

The [first commit](https://git.savannah.gnu.org/cgit/rcs.git/commit/?h=p&id=2a07671f9ce40cfab440c40c465357945f06aef2) from November 18th, 1989 reads:

> Import RCS 4.3 from <ftp://ftp.cs.purdue.edu/pub/RCS/>

GNU RCS tracks it history all the way back to the original RCS from 1982. GNU RCS was actively maintained by [Thien-Thi Nguyen](https://savannah.gnu.org/users/ttn), until his [death](https://lists.gnu.org/archive/html/emacs-devel/2023-09/msg00713.html) in October 2022. The project is unmaintained at the moment.

OpenRCS maintains a [reimplementation of RCS](https://cvsweb.openbsd.org/cgi-bin/cvsweb/src/usr.bin/rcs/) under the MIT license. It is distributed as part of OpenBSD since version 4.0. FreeBSD and NetBSD ship GNU RCS as part of their packages/ports.

#### Legacy
RCS is one of the most influential source control systems to this day. Systems like CVS and Perforce use RCS file formats to this day. Terminology such as commit, checkout, log are common source control terminology. RCS’s keyword expansion syntax ($Id$, $Date$) will find widespread adoption in other version control systems. Most modern source control system such as Git or Mercurial use similar separated-delta techniques.

### Conclusion

I hope you enjoyed this little overview of SCCS and RCS. In the next blog post we will take a look at the 1990s where the first centralized source control systems appear. They will allow multiple users to work on source code  concurrently and exchange commits via the network.

If you have corrections, suggestions or just want to say thanks, please send a mail to blog at (this domain).

## Appendix
#### Mail from Marc Rochkind
Mark kindly wrote me an email as a response to this article. I attached it in full:

> Hello!
> I just read your article. It seems pretty accurate, at least about the part I had to do with. I can add some things.
>
> You might want to reference my 1975 paper, which I have online here:
>
> mrochkind.com/aup/talks/SCCS-Slideshow.pdf
>
> Originally, there was no "sccs" command. That is, one typed "get", not "sccs get." Actually, I never heard of the "sccs" command until I read your article; sounds like an improvement. (I stopped working on SCCS about 50 years ago.)
>
> The original SNOBOL implementation didn't have a "delta" command. Rather, it allowed the programmer to edit the on-disk source file with punched card commands to change, add, or delete source code lines. (No terminals!) Since all edits went through SCCS, it knew what constituted the delta. But, in going to UNIX, it was obvious that "ed" had to be used, and this presented a problem: How would the system know what had happened? The "diff" command existed then, and it was amazingly good. So, I incorporated that into the system, resulting in the "delta" command. As I recall, it invoked "diff" as a subprocess; I didn't incorporate the code itself. There was only one editor for UNIX at the time, but, of course, many others came along later, such as "vi".
>
> The IBM SNOBOL punched-card-image version was used by only one application department at Bell Labs, and would have gone nowhere. SCCS became widely used only as part of the Programmer's Workbench, which you should look up if you're not familiar with it. Using UNIX as a front end for IBM and Univac mainframes was very attractive to programmers and became enormously popular in our corner of Bell Labs. As UNIX development took off, SCCS became part of the normal workflow. Personally, I was on to other things by then and I recall how surprised I was when I learned that SCCS had become so widely used.
>
> I really hardly knew anything when I invented SCCS, I was just a 25-year-old kid who was charged by upper management with doing something about our source code chaos. That's what I came up with. But, at Bell Labs, coming up with things was what we were all supposed to be doing.
>
> Good luck to you! If there's anything I can help with, let me know. By the way, I don't know your name -- your article seems to be unsigned.
>
> Marc Rochkind


[^1]: Taken from Wikipedia, https://en.wikipedia.org/wiki/Interleaved_deltas (Retrieved 18 March 2024).
[^2]: SCCS Commands from IBM AIX: https://www.ibm.com/docs/en/aix/7.2?topic=s-sccs-command
[^3]: Notable, the GPL was released on February 1st, 1989, just 9 months before Tichy applied it to RCS.
[^4]: `diff --rcs` produces an RCS-style diff!
[^5]: See https://www.tuhs.org/pipermail/tuhs/2019-September/018472.html for an interesting debate on SCCS vs RCS on the mailinglist of the Unix Heritage Society.