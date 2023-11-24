# 004 Build System


## Context

Any bigger Java project needs a build system. The most popular ones are Maven and Gradle, with Gradle coming in the flavors Groovy and Kotlin.

The Thoughtworks Tech Radar has recommended Gradle over Maven for years, as Gradle, being basically a programming language, is much more flexible than a configuration file like Maven's (https://www.thoughtworks.com/radar/tools/maven). With Gradle Kotlin, you even get compile-time checking, preventing errors in your Gradle Scripts. (https://www.thoughtworks.com/radar/languages-and-frameworks/gradle-kotlin-dsl). Also, due to incremental compilation, Gradle can compile projects faster.

That being said, there are also arguments for Maven. JetBrains, the company behind Kotlin, even recently started a new project, Amper, which would be like a 'lightweight' (non-XML) Maven. Gradle projects are scripts, and can be harder to debug than a plain configuration like Maven. Possibly even more annoyingly in Gradle usage, often Gradle gives warnings about features in your script being incompatible with newer Gradle versions! I've never seen the like with Maven projects, which tend to run 'out of the box'.

I am therefore tempted to conclude that for small, simple projects which may need only occasional maintainance, Maven may be more suitable; if a team is working full time on a project, and has Gradle experts, then Gradle will likely be the better choice. (Amper is in 2023 way too experimental to consider) Stack overflow trends point to about equal usage nowadays, with more historical support (questions/answers) for Maven (https://insights.stackoverflow.com/trends?tags=maven%2Cgradle)

As this project for now has limited scope, I propose Maven: we probably don't need the flexibility and extra build speed of Gradle, while we do want easy maintenance by a small or very small team that can only work on it occasionally.


## Decision

Let's use Maven for now.


## Status [Proposed, Accepted, Deprecated, Superseded]
Proposed


## Consequences
- build speed may be slightly lower, though for now this may not matter as this project will be smallish. Objective information on different build speeds is hard to get anyway, or uses huge projects.
- if this ever becomes a bigger project with a bigger team, we can likely switch to Gradle (Kotlin)
- if we ever need more flexibility, we can switch to Gradle
- for now, Maven seems best, we can always change if we encounter hiccups-but likely we won't. 