# VOLTA — Vlog di elettronica

Blog/vlog sull'elettronica in stile Apple, costruito con **Next.js 16**.

## Avvio in locale

```bash
cd ~/Desktop/"sito web"
npm install        # solo la prima volta
npm run dev
```

- Sito: **http://localhost:3000**
- Admin: **http://localhost:3000/admin** — password: `volta2026`

In locale il database è un file SQLite in `data/volta.db` (creato e riempito automaticamente al primo avvio).

## Scrivi articoli

1. Vai su `/admin` e accedi.
2. Clicca **Nuovo articolo**.
3. Scrivi normalmente nell'area di testo e usa la **barra degli strumenti** per formattare.
4. Salva come **bozza** o **Pubblica** (se pubblichi compare sull'homepage).

### La barra degli strumenti

Non serve scrivere codice: seleziona il testo e premi il pulsante che ti serve.

| Pulsante | Cosa fa |
| --- | --- |
| ↶ / ↷ | Annulla / ripeti |
| H1 H2 H3 / ¶ | Titoli e paragrafo normale |
| **B** *I* U ~~S~~ | Grassetto, corsivo, sottolineato, barrato |
| 🧹 | Togli tutta la formattazione |
| Elenchi | Elenco puntato e numerato |
| " | Citazione |
| Allineamenti | Sinistra, centro, destra |
| 🔗 | Inserisci un link |
| 🖼 | Inserisci un'immagine da URL |
| ⊞ | Inserisci una tabella (chiede righe e colonne) |
| `</>` | Blocco di codice |
| — | Linea separatrice |
| Colore / 🖍 | Colore del testo / evidenzia la selezione |
| ∑ | **Simboli tecnici**: Ω, kΩ, A, mA, V, mV, ⎓, ⏚, ±, ≈, ∞, √, °C, frazioni… |

Scorciatoie: `Ctrl+B` grassetto, `Ctrl+I` corsivo, `Ctrl+U` sottolineato, `Ctrl+Z` annulla.
`Ctrl/Cmd+Shift+V` incolla solo il testo, senza formattazione.

Sotto l'area di testo trovi il conteggio di parole, caratteri e il tempo di lettura stimato.
C'è anche il pulsante **Anteprima** per vedere come apparirà l'articolo pubblicato.

Il titolo genera automaticamente lo slug. Per la copertina incolla un **URL immagine** (es. foto da Unsplash); se lasci vuoto viene generato un gradiente automatico.

> Gli articoli scritti con la vecchia versione in Markdown restano leggibili e mostrano
> un pulsante per convertirli al formato visuale.

## Deploy gratuito online (Vercel)

Il site usa Vercel (hosting gratuito per Next.js) + Turso (database SQLite cloud, gratuito).

### 1. Database su Turso (una volta sola)

1. Registrati su [turso.tech](https://turso.tech) (account gratuito).
2. CLI: `brew install tursodatabase/tap/turso`
3. Crea il database:
   ```bash
   turso auth login
   turso db create voltadb
   turso db show voltadb --url          # copia la URL (libsql://...)
   turso db tokens create voltadb       # copia il token
   ```
4. Ne avrai bisogno al punto 4 su Vercel.

### 2. Carica il codice su GitHub

```bash
cd ~/Desktop/"sito web"
git init
git add .
git commit -m "VOLTA vlog"
gh repo create volta --public --source=. --push    # oppure crea il repo su GitHub e push
```

> `data/` e `.env.local` sono già in `.gitignore`: il DB locale non finisce su GitHub (quello li è solo per dev).

### 3. Importa il repo su Vercel

1. Registrati su [vercel.com](https://vercel.com) (collegato a GitHub).
2. **Add New Project** → importa il repo `volta` → **Deploy**.
3. Vercel riconosce Next.js automaticamente.

### 4. Imposta le variabili d'ambiente su Vercel

In **Settings → Environment Variables** aggiungi:

| Nome | Valore |
|------|--------|
| `ADMIN_PASSWORD` | la password che vuoi per l'admin (es. `volta2026`) |
| `SESSION_SECRET` | una stringa lunga e casuale |
| `TURSO_DATABASE_URL` | la URL `libsql://...` del punto 1 |
| `TURSO_AUTH_TOKEN` | il token del punto 1 |

Clicca **Deploy/Redeploy** e attendi il completamento.

Ora il tuo sito è online all'indirizzo `https://tuo-progetto.vercel.app`. Se quell'URL richiede troppo (spegnimenti automatici su FREE tier), puoi collegare un **dominio personale** in Settings → Domains.

### Aggiornare dopo modifiche

Ogni `git push` su `main` fa partire un nuovo deploy automatico su Vercel.

## Backup del database

Turso ha già backup automatici. Per esportare:

```bash
turso db dump voltadb        # scarica backup
```

## Struttura

```
app/           → pagine (Home, Articoli, Categorie, Chi sono, Admin)
components/    → Navbar, ArticleCard, Hero, MarkdownRenderer, RichTextEditor, CharacterPalette, Icon…
lib/           → db.ts (Turso/SQLite), auth.ts (sessioni), seed.ts (dati iniziali)
data/          → database locale (solo dev, non committato)
```