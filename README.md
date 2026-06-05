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


## v36

- Rimossa la scheda degli alert generali dalla panoramica lega.
- Alert mantenuti solo nel dettaglio delle singole squadre.
- Barra news rallentata ulteriormente.


## v37

- Su desktop, ridotta leggermente la colonna Rosa nel dettaglio squadra.
- Allargata la colonna Mercato.


## v38

- Su desktop, colonna Mercato ulteriormente allargata.
- Colonna Rosa leggermente più stretta.


## v41 - Volti calciatori nella Rosa

- Rimosso l'approccio dei loghi club reali.
- Aggiunta foto profilo del calciatore accanto al nome nel dettaglio Rosa.
- Apps Script usa API-Football Free stagione 2024/25 solo per recuperare foto giocatore.
- La mappa nome → foto resta in cache per 24 ore.
- Per forzare refresh: eseguire `forceRefreshSerieAPlayerPhotoMap`.


## v42 - URL Apps Script aggiornato

Questa versione usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```


## v43 - URL Apps Script confermato

Questa versione usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```

Compatibile con il codice Apps Script v9: foto giocatori con cache 15 giorni.


## v44 - Apps Script aggiornato

Dashboard collegata alla versione aggiornata dell'API Apps Script:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```

La mappa dei volti viene gestita lato Apps Script tramite cache.


## v48 - Rollback stabile v44 con deployment aggiornato

Questa versione ripristina la dashboard v44 e usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```


## v49 - Status attivo con deployment aggiornato

Questa versione usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```

Compatibile con il filtro `Status` gestito lato Apps Script.


## v50

- Le card dei calciatori con Status `PRESTITO_IN` sono evidenziate in giallo.
- La dashboard mostra subito i dati statici e aggiorna in background con Apps Script.


## v51 - URL Apps Script aggiornato

Questa versione usa:

```js
const SKL_API_URL = "https://script.google.com/macros/s/AKfycbztJtSp_-LBCJe7wTlp7_nsGO4gjlEkDvwDuV8LaHKiE-b_kl8p15AL5xq__HCaJlsq/exec";
```

Compatibile con:
- card gialle per `PRESTITO_IN`
- avvio rapido con dati statici
- news Gazzetta da cache Apps Script


## v52 - Evoluzione grafica dello stadio

- Aggiunte immagini dedicate per i livelli stadio da 0 a 8.
- Nel dettaglio squadra, l'immagine viene scelta automaticamente in base a `stadiumLevel`.
- Livello 1 e livello 2 mostrano già piccoli spalti, coerenti con la presenza del fattore campo.
- Layout responsive: immagine accanto ai dati stadio su desktop e sopra i dati su mobile.


## v53 - Ritocco sezione stadio

- Ridotta la dimensione della scheda immagine dello stadio.
- Rimossa la scritta sovrapposta all'immagine.


## v55 - Stadio fuori card

- Rimossa la card/contenitore attorno all'immagine dello stadio.
- Lo stadio ora appare come immagine libera, simile a logo e maglia.
- Altezza immagine allineata a quella delle due righe di card statistiche sulla destra.

## v56 - Ottimizzazione mobile

- Hero e ticker più compatti.
- Card riepilogo in due colonne.
- Scheda squadra, rosa e mercato adattati agli schermi stretti.
- Immagine stadio e statistiche ridimensionate.
- Tabelle mantenute scorrevoli orizzontalmente.


## v57 - Correzione importi mercato su mobile

- Le sottoschede Mercato passano a una sola colonna fino a 900 px.
- Gli importi `fm` non possono più sovrapporsi o uscire dalla card.
- Testi lunghi e badge importo sono gestiti con una griglia responsive.


## v58 - Menu laterale

- Aggiunto menu hamburger con drawer laterale.
- Navigazione per Home, Squadre, Movimenti di Mercato e Albo d'oro.
- Le sezioni vengono mostrate come viste separate senza ricaricare la pagina.
- Albo d'oro generato automaticamente dai premi presenti nei dati.


## v59 - Albo d'oro sintetico

- Albo d'oro diviso in tre schede fisse: Campionato, Winter Cup e Kings Trophy.
- Rimossi piazzamenti secondari e podi completi.
- Visualizzato esclusivamente il numero di trionfi per squadra.


## v60 - Trasferimenti visuali

- La pagina Mercato mostra soltanto trasferimenti di calciatori tra due squadre della lega.
- Ogni operazione presenta squadra di partenza, calciatore e squadra di destinazione con freccia direzionale.
- Foto del calciatore, formula del prestito, clausole e movimenti contabili sono riportati nella stessa scheda.
- Layout responsive con direzione verticale su mobile.


## v62 - Avvio con dati live

- I vecchi dati statici non vengono più mostrati durante l'apertura.
- La pagina attende il primo caricamento da Apps Script mostrando una schermata di caricamento.
- L'ultimo dataset live valido viene salvato nel browser e usato solo come fallback in caso di errore di rete.


## v63 - Barra di caricamento

- Sostituito lo spinner circolare iniziale con una barra di caricamento animata.


## v64 - Menu hamburger nella topbar

- Rimossa la scritta `Menu`.
- Il pulsante hamburger è stato spostato nella topbar, esattamente al posto della scritta.
- Eliminato il vecchio pulsante flottante nell’angolo sinistro.


## v65 - Menu persistente

- Il pulsante hamburger è ora nella barra superiore globale.
- Rimane visibile in Home, Squadre, Mercato e Albo d’oro.
- La barra è sticky e resta disponibile durante lo scorrimento.


## v66 - Drawer a destra

- La tendina laterale si apre ora dal lato destro dello schermo.
- Aggiornati bordo e ombra del pannello per il nuovo verso di apertura.


## v67 - Collegamento Leghe Fantacalcio

- Il pulsante secondario della Home ora apre la lega Saviano Kings League su Leghe Fantacalcio.


## v68 - Pulsanti hero corretti

- Rimosso il pulsante "Vai alle squadre".
- Il pulsante principale apre la lega su Leghe Fantacalcio.
- Ripristinato il pulsante "Regolamento" con collegamento al PDF locale.


## v69 - Sezione Prestiti migliorata

- I prestiti vengono mostrati solo come movimenti reali datati.
- Le note contrattuali del blocco "Clausole e note contrattuali" vengono agganciate al prestito corretto.
- Ogni prestito mostra direzione del trasferimento, formula, costo fisso e clausole in modo più leggibile.


## v70 - Fix dimensioni Prestiti su mobile

- Il badge con i fantamilioni non si estende più in altezza.
- Squadre e freccia sono allineate su una riga ordinata.
- Badge, clausole e costi sono stati compattati per smartphone.


## v71 - Prestiti desktop migliorati

- La card Prestiti si estende a tutta larghezza su desktop.
- Ogni prestito è mostrato come mini-card più ordinata e leggibile.
- Squadre, freccia, badge e clausole hanno una disposizione più pulita su schermi larghi.


## v72 - Mercato compatto

- Ridotte dimensioni e spaziature dell’intera sezione Mercato.
- I prestiti sono ora righe compatte.
- Clausole e dettagli si aprono solo quando richiesti.
- Migliorata la leggibilità sia su desktop sia su mobile.


## v73 - Layout Mercato corretto

- Guadagni dallo Stadio e Premi Competizioni sono posizionati accanto agli Svincoli sui desktop larghi.
- Su schermi più stretti il layout torna automaticamente a colonna singola.
- Nei Prestiti la tratta tra le squadre usa una riga completa, evitando nomi tagliati.


## v74 - Mercato e stagione

- Acquisti ora ha la stessa larghezza della card Prestiti.
- Corretto il testo stagione in `2025/26`.
- Guadagni Stadio divisi tra pareggi e vittorie fuori casa.
- Premi Competizioni mostra i fantamilioni ottenuti invece del solo piazzamento.


## v75 - Etichette rimosse

- Rimosse le descrizioni ridondanti relative agli introiti da vittorie, introiti da pareggi e premio ottenuto dal piazzamento.


## v76 - Rose per ruolo in Home

- La sezione **Rose per ruolo** è stata spostata nella pagina **Home**, subito sotto il riepilogo iniziale della lega.
- La pagina **Squadre** ora mostra solo la scheda dettagliata della squadra selezionata.
