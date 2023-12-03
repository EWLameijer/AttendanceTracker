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

Explore/execute and make notes of https://spring.io/guides/gs/messaging-stomp-websocket/

- Fancy graphics for showing student status
  https://www.baeldung.com/java-performance-mapping-frameworks
  API standards:
  POST: Created <= REsponseeNTITY, body, no location is fine
  GET/PATCH: ok, body
  DELETED: noContent <= REsponseeNTITY
  PUT: skip

## What should likely still be done:
1) going back and forth (past and future). Possibly also with calendar for quick jump
2) The things Juan and the other coaches can think of/need!
3) ERD
5) Ubiquitous language (document)
6) Coding standards (document)
7) Documents to write down feedback from (potential) users
8) Wireframes (possibly?)
10) lesson administration endpoint and front-end
11) enabling registerer to undo mistaken input
12) enabling websockets (automatic updating)
13) allowing students to be transferred to another group
14) nicer graphics (this can take a lot of time and effort!)
15) proper security (JWT)
16) possibly: adding notes or TODOs for students (or TODOs for the coaches)
17) deployment on ITvitae-infrastructure
18) possibly coupling to ITvitae's (Azure?) Active Directory
19) Finding a way to put historical data (Excel) into the database
20) Exporting certain data to Excel or Word or PDF format?
21) 
- geschiedenis kunnen opvragen vanaf een te kiezen datum
- geschiedenis kunnen opvragen van totaal
- interface waar groepen en hun lesdata ingevoerd kunnen worden of invoer d.mv. een excelbestand (keuze aan Chantal)
- met Chantal overleggen (in januari 2024) of de invoer hiermee compatibel is of als invoer gebruikt kan worden om de gewenste uitvoer te krijgen (zoals printjes om op te hangen)
- Zodra een status ingevuld wordt, moet dat tekstvak de bijbehorende statuskleur krijgen
- zou leuk zijn als mensen die op een werkplek wachten ook kunnen helpen

doel van de attendance tracker:
- makkelijker om aanwezigheid bij te houden
- voor een evaluatie makkelijk kunnen zien wat de percentages zijn qua aan/afwezigheid en redenen
- makkelijk maken van communicatie tussen zowel docent als studentbegeleiding als mensen afwezig zijn en waarom (dit gaat twee kanten op)
  (momenteel bij afwezigheid zonder bericht communiceren ze dit op teams, wellicht kan dit geautomatiseerd worden?)