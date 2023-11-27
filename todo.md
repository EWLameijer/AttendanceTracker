1) Scenarios and personas would be helpful
2) Wireframes would help
3) Coding conventions may be useful, including hor/vert slicing, KISS/YAGNI etc.
4) plugins IntelliJ
5) plugins VS Code
6) IntelliJ: actions on save & other settings
7) ADR: notes on Lombok?
8) Ubiquitous Language?
9) Create Scrumboard (Git? Trello?)
10) Possibly ERDs and/or DDD-like class diagrams
11) Create/add simple frontend

Programmatically:
-frontend: haal students-endpoint weg => of transformeer het in
groups-endpoint
-? heb ik nog een main page nodig .. misschien voor testen

- fundamentally: basic is view:
    - coach-view/juan/dates/... later remove name for login
    - teacher-view/wubbo/dates/...
    - admin-view/chantal/groups // all
    - admin-view/chantal/schedules
- window to edit groups
    - add / remove groups
    - add/remove students from group
- update students to not only have group, but also to-from dates
- window to add dates per group
    - add date and teacher

- Fancy graphics for showing student status

## Current Branch

// how to handle a student remove?
// data of the student should still exist
// is not a POST, skip PUT, not a delete, PATCH?
Make ProblemDetail by using that Aspect with
IllegalArgumentException

1) make the remove button remove the member (after confirmation)
2) add to each group a remove button
3) make the remove button remove the group (after confirmation)
4) add below each group one 'add member'-button
5) make the add button add the member, and then resort the group
6) start the form with a text field and add group button
7) make that add group button create a new group

## What should likely still be done:

1) The things Juan and the other coaches can think of/need!
2) ERD
3) UUID vs Long: research, make ADR
4) Ubiquitous language (document)
5) Coding standards (document)
6) Documents to write down feedback from (potential) users
7) Wireframes (possibly?)
8) group administration endpoint and front-end
9) lesson administration endpoint and front-end
10) enabling registerer to undo mistaken input
11) enabling websockets (automatic updating)
12) allowing viewing historical data of a student
13) allowing students to be transferred to another group
14) nicer graphics (this can take a lot of time and effort!)
15) proper security (JWT)
16) possibly: adding notes or TODOs for students
17) deployment on ITvitae-infrastructure
18) possibly coupling to ITvitae's (Azure?) Active Directory
19) Finding a way to put historical data (Excel) into the database
20) Exporting certain data to Excel or Word or PDF format?