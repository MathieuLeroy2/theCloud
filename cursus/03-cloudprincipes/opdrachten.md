# Labo 3 Een mediadienst op je eigen infrastructuur

Je maakt een VM vanuit een template en gebruikt die als Jellyfin-server. Je test de dienst op minstens twee clients: bijvoorbeeld Xubuntu en je laptop. Een telefoon mag als de netwerkroute klaarstaat. Reken op vier uur met een voorbereid template en certificaten.

Dien alleen [verslag.md](bestanden/verslag-sjabloon.md) in. Neem daarin ook je nieuwe VM-gegevens, opdrachten en configuraties op.

## H3.1 Je nieuwe server plannen

Gebruik als voorbeeld `cloud-media`, `192.168.77.110/24`, 2 vCPU, 2 GB RAM en een schijf van 32 GB. Controleer de waarden met de docent. Noteer het template, je vrije VMID, gateway, DNS, back-upplaats en de twee clients die gaan testen. Sluit niet-benodigde Windows-VM's uit hoofdstuk 2 af.

**Klaar als:** je weet welk adres je mag gebruiken en via welke route de clients dat bereiken.

## H3.2 Een sleutel maken en een VM uitrollen

Maak op Xubuntu een SSH-sleutelpaar met wachtzin. Maak in Proxmox een full clone van het Ubuntu-template. Vul vóór de eerste start gebruiker `student`, jouw publieke SSH-sleutel en netwerk in bij cloud-init. Controleer na de eerste start naam, adres, tijd en SSH-aanmelding.

**Klaar als:** je met jouw sleutel op de juiste server aanmeldt en de hostsleutel hebt gecontroleerd.

## H3.3 Jellyfin en media

Installeer Jellyfin via de officiële Ubuntu-installatieprocedure. Maak `/srv/media/Movies`, `/srv/media/Audio` en `/srv/media/Shows`. Upload drie kleine eigen of vrije testbestanden, passend bij de mappen. Controleer leesrechten voor Jellyfin.

Maak een beheeraccount en een afzonderlijk kijkaccount. De lokale beheerconsole of een tijdelijke SSH-tunnel helpt bij de eerste configuratie.

**Klaar als:** Jellyfin de testbestanden vindt en het kijkaccount geen beheerfuncties nodig heeft.

## H3.4 HTTPS en beperkte toegang

Installeer NGINX en pas de meegeleverde proxyconfiguratie aan. Gebruik het servercertificaat, de private sleutel en de CA-instructies van de opleiding. Voeg de lokale proxy `127.0.0.1` toe bij Jellyfins bekende proxies. Laat clienttoegang toe op HTTPS 443, niet rechtstreeks op 8096.

**Klaar als:** beide clients via het juiste HTTPS-adres aanmelden zonder certificaatwaarschuwing. Gebruik geen blijvende uitzondering of `curl -k` als oplossing.

## H3.5 Gebruiken en herstarten

Speel op beide clients een klein bestand af. Noteer account, client, adres en resultaat. Herstart Jellyfin en test opnieuw. Controleer ook of SSH blijft werken en rechtstreekse toegang tot 8096 vanaf de client geblokkeerd is.

**Klaar als:** je kunt tonen dat de dienst én de bewaarde bibliotheek werken.

## H3.6 Terugblik en bewaren

Beantwoord de vijf theorievragen. Schrijf daarnaast een korte keuze: welke taken zou een aanbieder overnemen als dit SaaS was? Welke taken hou jij zelf?

Bewaar de server voor later. Voeg de proxyconfiguratie en relevante commando's als codeblokken toe aan je enige verslag. Noteer certificaatnamen en vervaldatum, maar geen private sleutels of wachtwoorden.

| Onderdeel | Punten |
| --- | --- |
| H3.1 Plan en bereikbaarheid | 2 |
| H3.2 Template, cloud-init en SSH-sleutel | 4 |
| H3.3 Jellyfin, datarechten en twee accounts | 4 |
| H3.4 HTTPS en poortbeperking | 4 |
| H3.5 Twee clients en herstarttest | 3 |
| H3.6 Uitleg en één verslag | 3 |
| **Totaal** | **20** |
