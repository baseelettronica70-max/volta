import type { Client } from "@libsql/client/web";

export async function seedArticles(client: Client) {
  const cats = [
    { name: "Microcontrollori", slug: "microcontrollori" },
    { name: "Elettronica di base", slug: "elettronica-di-base" },
    { name: "Audio e Video", slug: "audio-e-video" },
    { name: "Hobby e Progetti", slug: "hobby-e-progetti" },
    { name: "Strumenti di misura", slug: "strumenti-di-misura" },
  ];

  const catIds: Record<string, number> = {};
  for (const c of cats) {
    const res = await client.execute({
      sql: "INSERT INTO categories (name, slug) VALUES (?, ?)",
      args: [c.name, c.slug],
    });
    catIds[c.slug] = Number(res.lastInsertRowid);
  }

  const articles = [
    {
      title: "Come avviarsi con ESP32: guida completa per principianti",
      slug: "guida-completa-esp32",
      excerpt: "Tutto quello che devi sapere per iniziare a programmare l'ESP32, dal montaggio del circuito al primo sketch.",
      content: `# Come avviarsi con ESP32

L'ESP32 è uno dei microcontrollori più versatili e accessibili del mercato. Con Wi-Fi e Bluetooth integrati, è perfetto per progetti IoT, domotica e molto altro.

## Cosa ti serve

- **ESP32 DevKit** (es. NodeMCU-32S o WROOM-32)
- Cavo USB-C o Micro-USB (dipende dalla board)
- Arduino IDE 2.x o PlatformIO
- Un po' di pazienza

## Primo collegamento

Collega l'ESP32 al PC tramite il cavo USB. Se non viene riconosciuto, potresti necessitare del driver **CP2102** o **CH340**, dipende dal chip seriale sulla tua scheda.

> **Consiglio:** inizia con il blink LED integrato per verificare che tutto funzioni.

## Installare Arduino IDE 2.x

1. Scarica Arduino IDE 2 da [arduino.cc](https://www.arduino.cc/en/software)
2. Apri le **Preferences** → *Additional Board Manager URLs*
3. Incolla: \`https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json\`
4. Vai su **Tools → Board → Board Manager**, cerca "esp32" e installa

## Il tuo primo sketch

\`\`\`cpp
#include <WiFi.h>

const char* ssid = "LaTuaRete";
const char* password = "LaTuaPassword";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Qui puoi aggiungere la tua logica
  delay(10000);
}
\`\`\`

## Possibili problemi

| Problema | Soluzione |
|----------|-----------|
| Board non rilevata | Controlla il driver seriale (CP2102/CH340) |
| Upload fallito | Tieni premuto il pulsante **BOOT** durante l'upload |
| Slow clock | Su alcune board serve tener premuto BOOT 3-4 secondi |

## Prossimi passi

Una volta che il collegamento Wi-Fi funziona, puoi iniziare a esplorare:
- Lettura di sensori (DHT22, BMP280)
- Comunicazione MQTT con Home Assistant
- Server web con ESPAsyncWebServer

Buon divertimento con l'ESP32! 🎉`,
      category_slug: "microcontrollori",
      pinned: 1,
    },
    {
      title: "I 5 multimetri migliori per hobbisti nel 2026",
      slug: "multimetri-migliori-2026",
      excerpt: "Dalla serratura di fascia alta al multiuso economico: ecco i multimetri che consigliamo.",
      content: `# I 5 multimetri migliori per hobbisti nel 2026

Un buon multimetro è lo strumento fondamentale di ogni banco da lavoro elettronica. Ecco la nostra classifica aggiornata.

## 1. Fluke 87V
Il re dei multimetri. Precisione militare, costruzione indistruttibile.
- **Prezzo:** ~350€
- **Ideal per:** professionisti che vogliono lo strumento migliore

## 2. UNI-T UT61E
Il miglior rapporto qualità/prezzo. True RMS, 22.000 counts.
- **Prezzo:** ~80€
- **Ideal per:** hobbisti avanzati

## 3. Rigol DM8050
L'altoparlante di casa Rigol. Display grande, PC connectivity.
- **Prezzo:** ~180€
- **Ideal per:** laboratori e sviluppo

## 4. Aneng Q1
Sorprendentemente buono per il prezzo. True RMS, misure abbondanti.
- **Prezzo:** ~35€
- **Ideal per:** principianti con budget limitato

## 5. FNIRSI DMT-9900
Ottimo display, misure accurate, ottimo design moderno.
- **Prezzo:** ~45€
- **Ideal per:** hobbisti

## Cosa cercare in un multimetro

- **True RMS** → misurazioni accurate anche con onde non sinusoidali
- **Cat. rating** → sicurezza su tensioni AC (CAT II/III/IV)
- **Counts** → più counts = maggiore risoluzione
- **Auto-ranging** → comodo ma a volte lento`,
      category_slug: "strumenti-di-misura",
      pinned: 0,
    },
    {
      title: "Realizzare un amplificatore audio con LM386",
      slug: "amplificatore-audio-lm386",
      excerpt: "Costruiamo da zero un semplice amplificatore audio per altoparlanti usando il noto chip LM386.",
      content: `# Realizzare un amplificatore audio con LM386

Il LM386 è un amplificatore audio a basso consumo, perfetto per progetti semplici come amplificare un segnale da jack o da un microfono.

## Componenti necessari

- 1x LM386
- 1x resistenza 10Ω
- 1x resistenza 10kΩ (potenziometro 10k)
- Condensatori: 10µF, 220µF, 0.05µF
- Altoparlante 8Ω
- Breadboard e cavi

## Schema del circuito

\`\`\`
Pin 1  (Gain+)  → pin 8 (Gain-) via 10µF (gain 200)
Pin 3  (Input+) → segnale audio
Pin 4  (GND)    → massa
Pin 5  (Output) → altoparlante via 220µF
Pin 6  (Vs)     → +4.5V a +12V
\`\`\`

## Note

- A 5V il volume è modesto ma sufficiente per un progetto didattico
- Con 9-12V il volume aumenta considerevolmente
- Aggiungi un condensatore da 0.05µF tra pin 7 e GND per ridurre il rumore

## Integrazione nel progetto

Puoi usare questo amplificatore per:
- Casse portatili DIY
- Radio FM homemade
- Retrocompatibilità di dispositivi vintage`,
      category_slug: "audio-e-video",
      pinned: 0,
    },
    {
      title: "Resistenze e condensatori: come leggere i codici colorati",
      slug: "codici-colorati-resistenze-condensatori",
      excerpt: "Impara a decifrare i colori sulle resistenze e i codici sui condensatori in modo veloce e sicuro.",
      content: `# Resistenze e condensatori: codici colorati

Decifrare i codici è una competenza fondamentale quando si lavora con componenti. Vediamo come farlo senza errori.

## Codice colore delle resistenze

Ogni striscia ha un significato:

| Colore | Valore | Moltiplicatore | Tolleranza |
|--------|--------|----------------|------------|
| Nero   | 0      | ×1             | —          |
| Marrone | 1     | ×10            | ±1%        |
| Rosso  | 2      | ×100           | ±2%        |
| Arancione | 3   | ×1k            | —          |
| Giallo | 4      | ×10k           | —          |
| Verde  | 5      | ×100k          | ±0.5%      |
| Blu    | 6      | ×1M            | ±0.25%     |
| Viola  | 7      | ×10M           | ±0.1%      |
| Grigio | 8      | ×100M          | —          |
| Bianco | 9      | ×1G            | —          |
| Oro    | —      | ×0.1           | ±5%        |
| Argento| —      | ×0.01          | ±10%       |

### Esempio pratico
**Rosso - Rosso - Marrone - Oro** = 220Ω ±5%

## Codici SMD (tre cifre)

Per i condensatori SMD si usano i **tre numeri**:
- Prime due cifre: valore significativo
- Terza cifra: moltiplicatore (potenza di 10 in picofarad)

**Esempio:** 104 = 10 × 10⁴ pF = 100nF = 0.1µF`,
      category_slug: "elettronica-di-base",
      pinned: 0,
    },
    {
      title: "Domotica con Home Assistant e ESP32",
      slug: "domotica-home-assistant-esp32",
      excerpt: "Configura un sistema domotico completo usando ESP32 e Home Assistant.",
      content: `# Domotica con Home Assistant e ESP32

Home Assistant è la piattaforma opensource più potente per la domotica. Vediamo come integrarla con gli ESP32.

## Prerequisiti

- Home Assistant installato (VM, Docker o Raspberry Pi)
- ESP32 dev board
- Sensori (DHT22 per temp/umidità, reed switch, ecc.)

## Installare ESPHome

\`\`\`bash
pip install esphome
\`\`\`

### Crea una configurazione

\`\`\`yaml
esphome:
  name: sala-sensori
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

sensor:
  - platform: dht
    pin: GPIO4
    temperature:
      name: "Temperatura Soggiorno"
    humidity:
      name: "Umidità Soggiorno"
    update_interval: 30s
\`\`\`

## Collegare a Home Assistant

Una volta flashato l'ESP32, esso viene scoperto automaticamente da Home Assistant via mDNS.

> **Vantaggio:** zero configurazione manuale, i sensori appaiono subito nell'interfaccia.`,
      category_slug: "hobby-e-progetti",
      pinned: 1,
    },
  ];

  for (const [i, a] of articles.entries()) {
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const daysAgo = (articles.length - i) * 3;
    const publishedAt = new Date(Date.now() - daysAgo * 86400000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    await client.execute({
      sql: `INSERT INTO articles (title, slug, excerpt, content, cover, category_id, status, pinned, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, NULL, ?, 'published', ?, ?, ?, ?)`,
      args: [
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        catIds[a.category_slug] ?? null,
        a.pinned,
        publishedAt,
        publishedAt,
        now,
      ],
    });
  }
}