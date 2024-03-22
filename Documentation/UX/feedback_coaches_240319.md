Demo AT & feedback over verdere wensen.
Aanwezig: Juan, Mark, Nouchka, Wubbo

Wensen voor aanpassingen:

- Geen invulvelden meer voor attendance, maar dropdowns met alle huidige opties. Waarschijnlijk kunnen we dan de afkortingen die in Excel gebruikt worden, ook laten vallen. Waarmee AT ook voor nieuwe gebruikers intuïtiever te gebruiken wordt.
- Als iemand te laat is, kan de aankomsttijd optioneel ingevuld worden bij het veld voor notities. "Te laat" kan ook een optie worden in die dropdown.
  Noot: de backend logica kan dan simpeler, want dan hoeven we niet meer te filteren op contains(":").
- De velden direct (of sneller / eerder) opslaan, zonder dat dit bevestigd hoeft te worden met een opslaanknop of op enter drukken.
  Noot: dat lijkt Wubbo gemakkelijk; de onChange de state laten aanpassen EN submitten. Wubbo denkt dat de backend dan wel een record niet meer toevoegt maar updated als dezelfde record minder dan een minuut geleden door dezelfde persoon veranderd is, anders krijg je iets van 15 records voor g ge geb gebr gebro gebrok gebroke (etcetera).
- Adminrechten voor de coaches om ook groepen te kunnen maken / bewerken.
  Mogelijke oplossing: laten we dan COACH als rol weghalen en Nouchka enzo de ADMIN-rol geven.
- Leraren de mogelijkheid geven, om met een opt-in (bijv. een toggle) ook de attendance van andere groepen dan hun eigen groep te zien en te bewerken.
- De melding op de schedule-view pagina dat er een nieuwe les is toegevoegd (of al bestond) willen ze liever als toast message hebben in groen (gelukt) & rood (bestaat al).
- Schedule-view pagina heeft een soort upgrade nodig, zodat er een List met classes gescheduled kan worden.
- De invoer bij Schedule-view kan ook fout gaan, dus we moeten iets maken om classes te kunnen deleten.
- Gebruikers moeten automatisch uitgelogd worden bij bijvoorbeeld het sluiten van de browser. Wubbo denkt dat SessionStorage hier misschien iets voor is.
- Binnenkort graag deployen. Waarschijnlijk is het handig als Olivier's hulp hierbij wordt ingeschakeld. Wubbo denkt dat we het binnen 2-3 weken live kunnen zetten.
- Een manier toevoegen waarop gebruikers hun eigen wachtwoord kunnen wijzigen is wel praktisch. Wubbo had het idee om iets met One Time Passwords te doen, zodat eenmalig ingelogd kan worden, waarna gebruikers hun eigen wachtwoord moeten kiezen.
