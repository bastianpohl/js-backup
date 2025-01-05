# Einführung
Dies ist ein kleines Backup- & Restore-Skript, welches sehr simpel gehalten. Es soll einfach nur eine Liste von Dateien sichern und diese bei Bedarf wiederherstellen

## Hauptfunktionen
- ** Backup alles **: Sichert eine Liste von Dateien an individuelle Orteda
- ** Wiederherstellung **: Spielt alle gesicherterten Dateien an den jeweils ursprünglichen Ort zurück.

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
Die zu sichernden Dateien werden in der `config.csv`-Datei gespeichert. Jeder Datensatz hat zwei Spalten. In der ersten Spalte steht die Pfad der zu sicherenden Datei. Die zweite Spalte beinhaltet den Pfadd unter dem die Datei gesichert wird.