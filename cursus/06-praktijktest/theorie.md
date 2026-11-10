# Voorbereiden op de praktijktest

In deze test combineer je wat je al geoefend hebt. Er komen geen nieuwe technieken bij. Je gebruikt je eigen VM's, Docker en de monitoring uit hoofdstuk 5.

## Korte herhaling van de woorden

| Woord | Wat bedoelen we hier? |
| --- | --- |
| VM — Virtual Machine | De virtuele computer waarop Ubuntu draait. |
| SSH — Secure Shell | De beveiligde verbinding waarmee je op afstand commando’s uitvoert. |
| CLI — Command Line Interface | Werken door commando’s te typen, bijvoorbeeld `docker run`. |
| Bind mount / volume | Opslag buiten de tijdelijke container, zodat gegevens bewaard blijven. |
| MQTT-broker en topic | Het berichtenprogramma en het onderwerpadres waarnaar je berichten stuurt. |
| Exporter | Een programma dat metingen aanbiedt aan Prometheus. |
| Query | Een vraag waarmee je de juiste metingen selecteert of berekent. |
| Alert | Een waarschuwingsregel die je op die metingen toepast. |
| JSON — JavaScript Object Notation | Het tekstformaat waarin Grafana je dashboard exporteert. |

## Wat moet je zonder een nieuw stappenplan kunnen?

Je kunt een VM via SSH bereiken, een map maken, een configuratie aanpassen en een container starten met `docker run`. Je weet hoe je een loopbackpoort via SSH vanaf Xubuntu bereikt.

Je kunt met `docker ps`, logs en een gerichte test nagaan wat werkt. Je weet dat een bestand in een bind mount of volume bewaard blijft wanneer je de container vervangt.

In Grafana kun je een paneel maken, een passende query kiezen en de eenheid uitleggen. Je hebt een alert al laten afgaan en na de test hersteld.

## Hoe pak je de test aan?

1. Lees eerst de hele opdracht en schrijf je adressen en namen in je verslag.
2. Maak de kleinste werkende versie. Test de verbinding voor je het dashboard afwerkt.
3. Verander één ding tegelijk wanneer iets fout gaat.
4. Bewaar je werk in één `verslag.md`, niet in losse bijlagen.
5. Laat bij de demonstratie zien waarom je tests het resultaat bewijzen.

Een fout die je begrijpt en gericht herstelt, is nuttig bewijs. Alleen een lange lijst gekopieerde commando's zonder resultaat zegt weinig.

## Wat staat vooraf klaar?

De docent controleert de OS-installaties, images, netwerktoegang, exporters en monitoringbasis vóór de drie uur beginnen. De nieuwe toetscontainer, zijn data, eigen dashboard en toetsalert maak je tijdens de test.

Je mag de gepubliceerde theorie en documentatie gebruiken volgens de afspraken van de docent. De docent bepaalt vooraf welke hulp is toegestaan. Modeloplossingen worden niet als toetsinstructie meegeleverd.
