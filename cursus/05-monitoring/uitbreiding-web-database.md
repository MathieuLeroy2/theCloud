# Extra Een webserver en database afzonderlijk volgen

Deze oefening bewaart de Apache/MariaDB-casus uit de oorspronkelijke cursus. Ze komt na het kernlabo en telt niet als extra werk binnen dezelfde vijf uur. Gebruik een aparte kleine Ubuntu-VM, bijvoorbeeld `cloud-extra` op `.140`, zodat de NGINX-opdracht ongewijzigd blijft. Noteer ook deze uitbreiding in hetzelfde verslag als H5.

## Opdracht

Installeer Apache en MariaDB. Meet daarna of beide programma's zelf werken en hoeveel databaseverkeer er loopt. Gebruik geen database-rootaccount als monitoringgebruiker. Laat de exporterpoorten alleen toe vanaf cloud-containers. Stop en start beide diensten één voor één en vergelijk de applicatiestatus met `up`.

## Een mogelijke uitwerking

**Op cloud-extra:**

```bash
sudo apt update
sudo apt install apache2 mariadb-server prometheus-apache-exporter prometheus-mysqld-exporter
sudo a2enmod status
sudo systemctl restart apache2
curl 'http://127.0.0.1/server-status?auto'
```

De Apache-statuspagina hoort lokale toegang te gebruiken via `Require local`. Maak die interne pagina niet publiek. Controleer de meegeleverde statusconfiguratie in `/etc/apache2/mods-enabled/status.conf`.

Ubuntu-pakketten gebruiken voor de exporters meestal `/etc/default/prometheus-apache-exporter` en `/etc/default/prometheus-mysqld-exporter`. Bekijk eerst hun service en beschikbare flags met `systemctl cat` en de exporter met `--help`. Gebruik voor Apache als scrape-URI `http://127.0.0.1/server-status?auto` en als luisteradres `:9117`.

**In de MariaDB-shell, gestart met `sudo mariadb`:**

```sql
CREATE USER 'exporter'@'localhost' IDENTIFIED BY 'Student123' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'exporter'@'localhost';
```

Gebruik ook voor dit monitoringaccount het vaste labowachtwoord `Student123`. Dit is een apart monitoringaccount. Voor het kernvoorbeeld gebruiken we alleen globale statusmetingen, niet het uitlezen van alle applicatietabellen.

Maak `/etc/prometheus/mysql-exporter.cnf`:

```ini
[client]
user=exporter
password=Student123
socket=/run/mysqld/mysqld.sock
```

Geef alleen root en de servicegebruiker van de exporter leesrecht. Controleer die gebruiker met `systemctl show prometheus-mysqld-exporter -p User`. Bij de Ubuntu-servicegebruiker `prometheus` kan dat met eigenaar `root:prometheus` en mode `0640`.

Geef via de ARGS-instelling van het Ubuntu-pakket aan dat de exporter deze config gebruikt:

```text
--config.my-cnf=/etc/prometheus/mysql-exporter.cnf --collect.global_status --no-collect.info_schema.tables --no-collect.info_schema.innodb_cmp --no-collect.info_schema.innodb_cmpmem --web.listen-address=:9104
```

Controleer de flagbenamingen van de door de opleiding vastgelegde exporter. Voeg niet zomaar SELECT op alle gebruikersdatabases toe als een niet-benodigde collector klaagt. Schakel die collector uit of laat de docent minimale extra rechten bepalen.

Herstart beide exporters en controleer hun logs en `/metrics`. Open alleen 9117 en 9104 vanaf het echte adres van cloud-containers. Voeg in Prometheus jobs `apache` en `database` toe met de passende adressen en herstart na een configuratiecontrole.

Gebruik in Grafana:

```promql
apache_up{job="apache"}
mysql_up{job="database"}
rate(mysql_global_status_bytes_sent{job="database"}[2m])
rate(mysql_global_status_bytes_received{job="database"}[2m])
```

De laatste twee zijn bytes per seconde. Genereer wat testverkeer met herhaalde lokale `SELECT 1;`-vragen of een voorbereide kleine dataset. Stop daarna alleen Apache, test en herstel; herhaal met MariaDB. De exporter kan bereikbaar blijven terwijl zijn toepassing uitstaat. Leg dat verschil uit en noteer eventuele collector-permissiefouten.

De docent moet de optionele Ubuntu-pakketflags en MariaDB-rechten op de gekozen lesimage nog apart toetsen.

## Bronnen

- [Apache Exporter](https://github.com/Lusitaniae/apache_exporter)
- [MySQL/MariaDB Exporter](https://github.com/prometheus/mysqld_exporter)
