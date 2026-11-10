# Versies en validatiestatus

De eerste uitwerking behoudt de Linux-basis uit het bestaande materiaal: Ubuntu Server 24.04 LTS en Xubuntu 24.04 LTS op x86-64. Dit beperkt de wijzigingen terwijl we de cursusstructuur en de labo's herwerken. Een LTS-reeks vastleggen is nog geen geteste cursusrelease: registreer hieronder de werkelijk gebruikte images en updates.

| Onderdeel | Basis voor deze uitwerking | Praktijkstatus |
| --- | --- | --- |
| Proxmox VE | 9.x, concrete ISO vast te leggen door opleiding | Nog te testen op lesinfrastructuur |
| Hosthypervisor route A | Institutionele versie met nested KVM; oorspronkelijk VMware Workstation Pro | Nog te kiezen en te testen |
| Ubuntu Server | 24.04 LTS amd64 | Exacte ISO en pakketstand nog te registreren |
| Xubuntu | 24.04 LTS amd64 met Xfce en NetworkManager | Exacte ISO en pakketstand nog te registreren |
| NGINX en OpenSSH | Distributiepakketten van bovenstaande Ubuntu-basis | Echte VM-installatie nog te testen |
| Marp CLI | 4.5.1, met afhankelijkheden vastgelegd in `package-lock.json` | HTML-build en render van 24 slides gecontroleerd |

## Controle van de bronbestanden

Op 10 november 2026 zijn de volgende controles uitgevoerd op de eerste uitwerking van hoofdstuk 1:

- Lokale Markdown-links en het gebruikte kopanker gecontroleerd met `npm run check`.
- De Marp-slides naar HTML gebouwd en alle 24 gerenderde slides bekeken. Een aanvullende geometriecontrole vond geen inhoud buiten het slidevlak.
- De voorbeeldwebsite in Firefox bekeken; de lokale CSS laadt.
- De 25 Bash-codeblokken uit theorie, opdrachten en oplossingen met `bash -n` gecontroleerd. Dit controleert syntaxis en voert de commando's niet uit.
- Het Netplan-voorbeeld als YAML geparseerd. Dit vervangt geen `netplan generate` op de bedoelde Ubuntu-versie.

De echte installatie, firewallwerking, nested virtualisatie en snapshot-/back-uprestore zijn nog niet uitgevoerd in de lesomgeving. Ook PDF-export is nog niet apart gevalideerd.

De installatie van de vastgelegde Marp-tooling meldt in de ontwikkelafhankelijkheden 12 npm-auditmeldingen, waarvan 10 als hoog geclassificeerd. Deze betreffen onder meer de browser-/archiefketen en niet een op de gast-VM geïnstalleerde webapplicatie. Er is geen geforceerde downgrade of onbeproefde dependency-override toegepast. Gebruik de tooling voor vertrouwde cursusbronnen en controleer upstream updates vóór een volgende publicatie. De lockfile bevriest versies; ze lost upstream meldingen niet op.

## Registratie van de lesomgeving

Vul bij de praktijkvalidatie in:

```text
Datum:
Uitvoerder:
Route A of B:
Host-OS en hosthypervisor:
Proxmox-versie (pveversion):
Proxmox ISO en SHA256:
Ubuntu Server ISO en SHA256:
Xubuntu ISO en SHA256:
NGINX-versie (nginx -v):
Gastkernel (uname -r):
Snapshotstorage:
Back-upstorage en fysieke locatie:
Volledige opdracht uitgevoerd binnen:
Afwijkingen:
```

## Acceptatie voor praktijkvalidatie

- Beide gasten starten met KVM en passen binnen het toegewezen RAM.
- Vaste IP's, gateway en DNS werken na een reboot.
- De website en CSS zijn bereikbaar vanaf Xubuntu en de toegestane beheerclient.
- SSH-hostsleutelcontrole en SFTP-overdracht zijn uitgevoerd.
- Firewallregels laten de bedoelde SSH- en HTTP-tests toe.
- Een gestopte NGINX-service levert de verwachte storing en is hersteld.
- Een disksnapshot herstelt de vorige inhoud.
- Een back-up is naar een andere VMID hersteld en geïsoleerd getest.
- De student kan de werkomgeving bewaren voor het vervolg.

Een Markdown-controle of geslaagde HTML-build bewijst geen werkende nested virtualisatie. Noteer desktopcontroles en controles in echte VM's afzonderlijk.
