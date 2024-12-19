# Einführung

Willkommen zu unserem JavaScript-Backup-Tool! Dieses Tool wurde entwickelt, um Entwicklern dabei zu helfen, ihre JavaScript-Projekte effizient zu sichern und wiederherzustellen. Es bietet eine einfache Möglichkeit, regelmäßige Backups zu erstellen und sicherzustellen, dass Ihre Arbeit immer geschützt ist.

## Hauptfunktionen

- **Automatische Backups**: Planen Sie regelmäßige Backups Ihrer Projekte.
- **Einfache Wiederherstellung**: Stellen Sie Ihre Projekte mit nur wenigen Klicks wieder her.
- **Benutzerfreundlich**: Intuitive Benutzeroberfläche für eine einfache Bedienung.

## Installation

Um das Tool zu installieren, führen Sie den folgenden Befehl aus:

```bash
npm install js-backup-tool
```

## Verwendung

Nach der Installation können Sie das Tool mit dem folgenden Befehl starten:

```bash
js-backup-tool start
```

Weitere Informationen und detaillierte Anweisungen finden Sie in der [Dokumentation](#).

Viel Spaß beim Sichern Ihrer Projekte!
## Modi

Das Tool bietet zwei Hauptmodi:

- **Backup-Modus**: Führen Sie den folgenden Befehl aus, um ein Backup Ihrer Dateien zu erstellen:
    ```bash
    node backup --backup
    ```
- **Restore-Modus**: Verwenden Sie diesen Befehl, um Ihre Dateien aus einem Backup wiederherzustellen:
    ```bash
    node backup --restore
    ```

## Konfiguration

Die zu sichernden Dateien werden in der `config.csv`-Datei gespeichert. Stellen Sie sicher, dass diese Datei korrekt konfiguriert ist, um die gewünschten Dateien zu sichern.