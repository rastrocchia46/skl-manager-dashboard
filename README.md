# SKL Manager Dashboard

Dashboard statica per GitHub Pages della Saviano Kings League.

## File

- `index.html` — struttura della pagina
- `style.css` — grafica responsive verde/nero
- `script.js` — logica dashboard, selettore squadra, alert, tabelle
- `data.js` — dati generati dai CSV esportati dal Google Sheet

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub, ad esempio `skl-manager-dashboard`.
2. Carica questi quattro file nella root del repository.
3. Vai in **Settings → Pages**.
4. In **Build and deployment**, scegli:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salva e apri il link GitHub Pages generato.

## Aggiornamento dati

Per ora `data.js` contiene i dati estratti dai CSV caricati in chat.
La prossima evoluzione è sostituire `data.js` con il caricamento automatico dai link CSV pubblici dei singoli fogli Google Sheet.

## Note sui dati

Per controlli automatici più precisi, conviene aggiungere nel Google Sheet una colonna `Stato` nella rosa, con valori tipo:

- Attivo
- Prestito in uscita
- Prestito in entrata
- Asteriscato
- Svincolato

Così la dashboard potrà contare solo i giocatori attivi.


## Collegamento dati live

Questa versione usa Google Apps Script:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```

Se l'API non risponde, la dashboard usa i dati statici di fallback contenuti in `data.js`.


## Aggiornamento automatico

La dashboard rilegge automaticamente i dati da Apps Script ogni 15 secondi.
La squadra selezionata resta aperta durante l'aggiornamento.


## Barra notizie

La barra notizie usa due feed RSS come fonte primaria:
- Football Italia
- The Cult of Calcio

Il caricamento prova prima RSS2JSON e poi AllOrigins come fallback.
Le notizie vengono aggiornate automaticamente ogni 10 minuti.


## Barra notizie Gazzetta

La barra news usa i feed RSS di Gazzetta per Serie A / Calcio.
Il codice prova più endpoint Gazzetta in ordine e usa RSS2JSON + AllOrigins come fallback.


## Fix caricamento news

La barra news viene avviata subito, indipendentemente dal caricamento dati Apps Script.
Il caricamento dati Apps Script ha un timeout di 8 secondi per evitare blocchi iniziali.


## News tramite Apps Script

Da questa versione la barra notizie non legge più RSS dal browser.
Le news vengono lette da Apps Script e arrivano dentro il JSON della dashboard nel campo `news`.

Per abilitarle:
1. Apri Apps Script.
2. Sostituisci tutto `Codice.gs` con il contenuto del file `apps_script_Code_v2_news.gs`.
3. Salva.
4. Esegui `buildDashboardData` per autorizzare anche `UrlFetchApp`.
5. Gestisci deployment → matita → Nuova versione → Distribuisci.


## URL Apps Script attivo

Questa versione usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```
