# 001_type_of_application


## Context
The application should let:
1) the primary users, coaches: help them easily find which students are absent today, and who have a history of being late or not showing up.
2) the data entry people - the teachers: help them register which students are present or absent.

This suggests a shared database, so not a desktop app (though I suppose one could make a desktop frontend with a database backend). Still, installing and upgrading software versions on a desktop app is relatively laborious (people _will_ forget to do it or won't have time), so a web app seems best.

Generally, though, most apps if there are no special cases should either be web apps or mobile apps; with web apps being likely more useful in this case as the coaches tend to interact/copy-paste data mostly into emails, Excel and the DVS system, which are more easily used on desktop and laptop computers than on mobile phones.


## Decision
We will make a web app.


## Status
_Proposed_ 

[Proposed, Accepted, Deprecated, Superseded]


## Consequences
- advantages: no installation or upgrading of local clients necessary
- if we ever want to add a mobile front-end, we can (re)use at least the backend code.
- we need to pay more attention to security, though basically you _always_ need security with a shared database.
- we should reconsider the decision if the coaches overwhelmingly prefer a mobile app.