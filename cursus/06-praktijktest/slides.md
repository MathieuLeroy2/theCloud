---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: De praktijktest
header: 'The Cloud · Hoofdstuk 6'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# De praktijktest

The Cloud · Hoofdstuk 6

---

# Je combineert wat je al kunt

Een toepassing in een container, bewaarde data
en een eigen dashboard.

Er komen geen nieuwe technieken bij.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Twee varianten

**A:** een website met HTML voor inhoud en CSS voor opmaak.

**B:** een MQTT-broker, het programma voor sensorberichten.
Een **topic** is het onderwerpadres van zo’n bericht.

De docent vertelt vooraf welke variant je maakt.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wat staat vooraf klaar?

Je virtuele machines (**VM = Virtual Machine**).
Een beveiligde opdrachtverbinding (**SSH = Secure Shell**).
Docker en de images: pakketten waaruit je containers maakt.
Exporters: programma’s die meetgegevens aanbieden.

De toetscontainer, data, dashboard en alert maak je zelf.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Werk in kleine stappen

Maak eerst de toepassing bereikbaar.
Test daarna het opnieuw maken met dezelfde data.
Bouw vervolgens dashboard en alert.

Noteer tijdens het werken wat je doet en ziet.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een fout onderzoeken

Gebruik de console, logs en een gerichte clienttest.

Verander één ding tegelijk.
Leg uit wat je testresultaat betekent.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Metingen opvragen en bewaren

Een **query** is een vraag waarmee je meetgegevens kiest.
Een **alert** is een waarschuwingsregel voor die gegevens.

**JSON = JavaScript Object Notation**.
In dat tekstformaat exporteer je het Grafana-dashboard.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Het eindresultaat

Je demonstreert de werking en dient **verslag.md** in.

Alle instellingen, code, query’s, dashboard-JSON
en testresultaten staan in dat ene bestand.
Alle accounts gebruiken **Student123**. Geen private sleutels of bijlagen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
