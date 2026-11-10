# Oplossingen bij labo 3

De docent levert een Ubuntu Server-template, een toegestane adresreeks en certificaten voor het lab. Zonder die voorbereiding hoef je geen publieke cloudaccount te maken. Gebruik je werkelijke waarden in plaats van de voorbeeldadressen.

## H3.1 Je plan

Voorbeeld: VM `cloud-media`, adres `192.168.77.110/24`, gateway en DNS `.2`, 2 vCPU, 2 GB RAM, schijf 32 GB. Xubuntu `.200` en de beheerclient op de laptop testen. De opleiding bevestigt hun route naar het labsubnet.

## H3.2 De VM en SSH

**Op Xubuntu:**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/thecloud-h3
cat ~/.ssh/thecloud-h3.pub
```

Vul `Student123` in als het programma om een wachtzin vraagt en herhaal die bij de bevestiging. Bestaat dat bestand al, overschrijf het niet: kies een andere naam en pas de latere commando's aan. De inhoud van `.pub` is de publieke sleutel. Het bestand zonder `.pub` blijft privé.

**In Proxmox:** kies het docenttemplate, **Clone**, een vrije VMID en **Full clone**. Geef de naam `cloud-media`. Controleer RAM, CPU en bridge. Pas bij **Cloud-Init** de gebruiker, publieke SSH-sleutel, DNS en IPv4-instellingen aan. Stel `Student123` in als wachtwoord voor het lokale account. Pas daarna de cloud-init-disk opnieuw toe met de beschikbare knop en start de VM. Het template moet cloud-init bevatten; zomaar de bestaande `cloud-web` kopiëren is niet hetzelfde.

Open de VM-console voor de vertrouwde hostsleutelcontrole. Een template met alleen sleuteltoegang heeft mogelijk geen consolewachtwoord; de docent stelt voor de console het lokale account in met `Student123`. Controleer de Ed25519-vingerafdruk zoals in H1.

**Op Xubuntu:**

```bash
ssh -i ~/.ssh/thecloud-h3 -o HostKeyAlgorithms=ssh-ed25519 student@192.168.77.110
```

**Daarna op cloud-media:**

```bash
hostnamectl
ip -br address
ip route
cloud-init status --wait
```

De eerste configuratie hoort voltooid te zijn. Controleer ook DNS en tijd, net als in H1. Voor de lokale consoletoegang gebruik je `Student123`. De docent moet een template gebruiken dat de naam en sleutels per nieuwe VM goed opbouwt.

## H3.3 Jellyfin installeren

**Op cloud-media:**

```bash
sudo apt update
sudo apt install curl ca-certificates
mkdir -p ~/jellyfin-install
cd ~/jellyfin-install
curl -fSLO https://repo.jellyfin.org/install-debuntu.sh
curl -fSLO https://repo.jellyfin.org/install-debuntu.sh.sha256sum
sha256sum -c install-debuntu.sh.sha256sum
```

Ga alleen verder als de controle `OK` toont. Bekijk het script met `less install-debuntu.sh`. De officiële procedure voegt de pakketbron toe en installeert Jellyfin. De checksum controleert de download; haal beide bestanden daarom van de officiële HTTPS-bron.

```bash
sudo bash install-debuntu.sh
systemctl status jellyfin --no-pager
curl -I http://127.0.0.1:8096
```

Je verwacht een draaiende service en een HTTP-antwoord, mogelijk een doorverwijzing. Een **pakketbron** is de plaats waar Ubuntu software en updates ophaalt. **Checksum** betekent een berekende controlecode waarmee je controleert of het gedownloade bestand overeenkomt met de aangeboden code.

Noteer de pakketversie met `dpkg-query -W jellyfin-server`. De docent kan de gebruikte pakketten voor een leseditie vooraf vastleggen.

### De mediamappen

**Op cloud-media:**

```bash
sudo install -d -o student -g jellyfin -m 2750 /srv/media
sudo install -d -o student -g jellyfin -m 2750 /srv/media/Movies /srv/media/Audio /srv/media/Shows
```

`student` mag bestanden plaatsen. De groep `jellyfin` mag lezen en de mappen openen. De extra `2` zorgt dat nieuwe bestanden in deze mappen de groep jellyfin overnemen.

Upload met SFTP vanaf Xubuntu naar deze mappen. Gebruik je eigen sleutel:

```bash
sftp -i ~/.ssh/thecloud-h3 student@192.168.77.110
```

Je kunt in SFTP bijvoorbeeld `put eigen-test.mp4 /srv/media/Movies/eigen-test.mp4` gebruiken. Pas de bestandsnaam aan. Beperk na de upload de rechten en controleer één werkelijk bestand:

```bash
sudo find /srv/media -type d -exec chmod 2750 {} \;
sudo find /srv/media -type f -exec chmod 0640 {} \;
sudo -u jellyfin test -r /srv/media/Movies/eigen-test.mp4
echo $?
```

`0` betekent dat Jellyfin dit bestand kan lezen. Gebruik je een andere bestandsnaam, pas de test aan. Een onverwachte groep herstel je gericht met `sudo chgrp jellyfin /pad/naar/bestand`.

### De eerste configuratie

**Op Xubuntu:** open tijdelijk een tunnel; laat dit terminalvenster open:

```bash
ssh -i ~/.ssh/thecloud-h3 -L 18096:127.0.0.1:8096 student@192.168.77.110
```

Open daar in de browser `http://localhost:18096`. De SSH-verbinding stuurt die poort versleuteld door naar Jellyfin. Doorloop de wizard, maak een beheeraccount met wachtwoord `Student123` en voeg de drie mappen toe als passende bibliotheken. Zet automatisch port mapping/UPnP niet aan.

Maak bij gebruikers een afzonderlijk kijkaccount met `Student123` dat alleen de bedoelde bibliotheken mag zien. Voeg bij de geavanceerde netwerkinstellingen **Known proxies** `127.0.0.1` toe. Laat de overige standaardinstellingen staan tenzij de docent een concrete aanpassing opgeeft.

## H3.4 HTTPS met NGINX

**Op cloud-media:**

```bash
sudo apt install nginx ufw
sudo install -d -m 0700 /etc/nginx/tls
```

De opleiding laat je een certificaat voor jouw serveradres en de bijbehorende sleutel plaatsen. Een **CA** (*Certificate Authority*) is de uitgever die het certificaat ondertekent. De publieke CA helpt je client die uitgever vertrouwen; de private server- en CA-sleutels blijven geheim. De bestanden heten hier `/etc/nginx/tls/media.crt` en `/etc/nginx/tls/media.key`, met eigenaar root en alleen leesrecht voor root op de private sleutel (`0600`). Gebruik de overdrachtsprocedure van de docent; plak de sleutel nooit in je verslag.

Kopieer [de proxyconfiguratie](bestanden/media.nginx.conf.example) naar `/etc/nginx/sites-available/media`. Laat de paden aansluiten op de echte certificaatbestanden.

```bash
sudo ln -s /etc/nginx/sites-available/media /etc/nginx/sites-enabled/media
sudo nginx -t
sudo systemctl reload nginx
```

Bestaat de link al? Controleer hem in plaats van steeds een extra link te maken. `nginx -t` moet slagen vóór de reload.

Laat op de eigen VM alleen de nodige clientpoorten toe:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.77.0/24 to any port 22 proto tcp
sudo ufw allow from 192.168.77.0/24 to any port 443 proto tcp
sudo ufw enable
sudo ufw status verbose
```

Dit is een nieuwe native server, zonder Docker-poortpublicaties. Verwijder een eventuele eerdere brede 8096-regel via `sudo ufw status numbered` en de betreffende regel, samen met de docent. Sta 8096 niet toe naar het clientnetwerk. De lokale proxy kan Jellyfin via loopback bereiken.

**Op beide clients:** installeer alleen de door de docent bevestigde lab-CA als vertrouwde uitgever. Het certificaat van de server moet het echte IP-adres of de gebruikte DNS-naam bevatten. Op Xubuntu kan dat via de systeemcertificaatmap en `update-ca-certificates`; Firefox vraagt afhankelijk van het profiel ook import onder **Authorities**. De docent levert daarvoor de exacte procedure.

```bash
curl -I https://192.168.77.110
```

Dit moet werken zonder `-k`. Open vervolgens datzelfde adres in de browser. Een naamfout of onbekende uitgever los je op bij certificaat, adres of trustinstelling; niet met een blijvende uitzondering.

## H3.5 Gebruiken en herstarten

Speel als kijkgebruiker een klein testbestand af op Xubuntu en de tweede client. Noteer de client, URL en uitkomst. Gebruik een browser als een aparte app niet beschikbaar is.

**Op cloud-media:**

```bash
sudo systemctl restart jellyfin
systemctl is-active jellyfin
```

Test opnieuw. De accounts, bibliotheken en bestanden moeten bewaard zijn. Test vanaf Xubuntu ook `curl --max-time 5 -I http://192.168.77.110:8096`. Rechtstreeks via het clientnetwerk hoort dat te mislukken; via HTTPS blijft het werken. De eerder gemaakte tunnel sluit je na de eerste configuratie.

## H3.6 Antwoorden en fouten zoeken

1. Het template bespaart de gewone OS-installatie. Cloud-init vult per VM de eerste eigen instellingen in.
2. De private sleutel, hier `~/.ssh/thecloud-h3`, blijft op je client. Alleen `.pub` gaat naar Proxmox.
3. De opleiding beheert de fysieke hardware; jij beheert jouw VM en Jellyfin-accounts.
4. Het certificaat controleert en beveiligt de verbinding, maar maakt geen ontbrekende netwerkroute.
5. Je oefent VM-aanmaak, gedeelde capaciteit en toegang via het netwerk. Je hebt niet automatisch snelle elasticiteit, volledige selfservice of verbruiksfacturatie.

Geen SSH? Controleer adres, cloud-init-resultaat, gebruiker en publieke sleutel. Geen media? Controleer pad en leesrecht als jellyfin. Geen HTTPS? Test eerst Jellyfin via loopback, daarna `nginx -t`, het certificaat en de clientroute. Een slecht afspeelbaar bestand kan een formaat- of capaciteitsprobleem zijn; probeer een klein bekend testbestand.

Bewaar alle relevante uitvoer en de proxyconfiguratie in één `verslag.md`. De VM blijft staan; je verslag bevat geen private sleutel of mediabijlagen.
