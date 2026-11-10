# Hoofdstuk 1 Hypervisors en virtuele infrastructuur

Je bouwt een kleine serveromgeving met Proxmox VE. Een Ubuntu Server-VM biedt een website aan. Een Xubuntu-VM gebruikt die dienst. Je leert de onderdelen configureren, hun communicatie testen en een eerdere toestand herstellen. Deze omgeving blijft beschikbaar voor de volgende hoofdstukken.

## Leerdoelen

Na dit hoofdstuk kun je:

1. De rol van een hypervisor uitleggen en type I, type II en nested virtualisatie onderscheiden.
2. Proxmox in je toegewezen oefenomgeving installeren en de beheerinterface bereiken.
3. VM's maken met een onderbouwde keuze voor CPU, RAM, disk en netwerk.
4. Twee Linux-gasten vaste IPv4-instellingen geven en hun netwerk testen.
5. Een website via NGINX publiceren met passende bestandsrechten en beheertoegang.
6. Een eenvoudige storing onderzoeken en een snapshot en back-up gecontroleerd herstellen.

## Materiaal en leesvolgorde

| Bestand | Gebruik |
| --- | --- |
| [Theorie](theorie.md) | Zelfstandige uitleg en begrippen |
| [Slides](slides.md) | Marp-presentatie voor de les |
| [Opdrachten](opdrachten.md) | Labo met controlepunten en beoordeling |
| [Oplossingen](oplossingen.md) | Modeluitwerking, verklaringen en troubleshooting |
| [Labkaart](bestanden/labkaart-sjabloon.md) | Jouw toegewezen netwerk en resources |
| [Verslagsjabloon](bestanden/verslag-sjabloon.md) | Bewijs en reflectie bij H1.1 tot en met H1.8 |
| [Voorbeeldconfiguratie netwerk](bestanden/01-lab-server.yaml.example) | Aan te passen Netplan-voorbeeld voor Ubuntu Server |
| [Voorbeeldwebsite](bestanden/website/index.html) | Kleine startwebsite met [CSS](bestanden/website/style.css) |

Voorzie ongeveer 4,5 uur voor het labo, na de theorie. ISO's en het netwerk zijn vooraf beschikbaar. De [startgids](../00-start/README.md) en je ingevulde labkaart zijn het vertrekpunt.

De voorbeelden gebruiken `192.168.77.0/24`. Gebruik de waarden uit jouw labkaart als die afwijken. De modeloplossing beschrijft beide infrastructuurroutes. De docent moet de uitwerking nog op de concrete lesinfrastructuur valideren.
