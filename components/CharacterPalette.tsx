"use client";

import { useEffect, useRef } from "react";

export const SYMBOL_GROUPS: { title: string; items: { ch: string; name: string }[] }[] = [
  {
    title: "Basi elettriche",
    items: [
      { ch: "Ω", name: "ohm" }, { ch: "kΩ", name: "kiloohm" }, { ch: "MΩ", name: "megaohm" },
      { ch: "A", name: "ampere" }, { ch: "mA", name: "milliampere" },
      { ch: "µA", name: "microampere" }, { ch: "nA", name: "nanoampere" },
      { ch: "V", name: "volt" }, { ch: "mV", name: "millivolt" },
      { ch: "W", name: "watt" }, { ch: "mW", name: "milliwatt" },
      { ch: "Hz", name: "hertz" }, { ch: "kHz", name: "kilohertz" },
      { ch: "MHz", name: "megahertz" }, { ch: "GHz", name: "gigahertz" },
    ],
  },
  {
    title: "Simboli elettrici",
    items: [
      { ch: "⎓", name: "corrente continua DC" },
      { ch: "∿", name: "corrente alternata AC" },
      { ch: "⏚", name: "terra / massa" },
      { ch: "⊥", name: "terra funzionale" },
      { ch: "⚡", name: "alta tensione" },
      { ch: "⏦", name: "corrente continua" },
      { ch: "⎀", name: "corrente continua pulsata" },
      { ch: "∥", name: "parallelo" },
      { ch: "⊥", name: "orto / perpendicolare" },
      { ch: "⌁", name: "onda" },
      { ch: "⏢", name: "onda rettificata" },
      { ch: "✗", name: "non collegato" },
    ],
  },
  {
    title: "Operatori matematici",
    items: [
      { ch: "±", name: "più o meno" }, { ch: "∓", name: "meno o più" },
      { ch: "×", name: "per" }, { ch: "÷", name: "diviso" },
      { ch: "≈", name: "circa uguale" }, { ch: "≠", name: "diverso" },
      { ch: "≤", name: "minore o uguale" }, { ch: "≥", name: "maggiore o uguale" },
      { ch: "∞", name: "infinito" }, { ch: "√", name: "radice quadrata" },
      { ch: "∑", name: "somma" }, { ch: "∏", name: "prodotto" },
      { ch: "∫", name: "integrale" }, { ch: "∂", name: "derivata" },
      { ch: "∆", name: "delta / variazione" }, { ch: "π", name: "pi greco" },
    ],
  },
  {
    title: "Frazioni e potenze",
    items: [
      { ch: "½", name: "un mezzo" }, { ch: "⅓", name: "un terzo" },
      { ch: "¼", name: "un quarto" }, { ch: "¾", name: "tre quarti" },
      { ch: "⅔", name: "due terzi" }, { ch: "²", name: "al quadrato" },
      { ch: "³", name: "al cubo" }, { ch: "¹", name: "alla prima" },
      { ch: "⁰", name: "all'zeresimo" },
    ],
  },
  {
    title: "Frecce e unità",
    items: [
      { ch: "→", name: "freccia destra" }, { ch: "←", name: "freccia sinistra" },
      { ch: "↑", name: "freccia su" }, { ch: "↓", name: "freccia giù" },
      { ch: "↔", name: "freccia doppia" }, { ch: "⇒", name: "quindi" },
      { ch: "°", name: "gradi" }, { ch: "°C", name: "gradi Celsius" },
      { ch: "°F", name: "gradi Fahrenheit" }, { ch: "′", name: "primi" },
      { ch: "″", name: "secondi" }, { ch: "%", name: "percentuale" },
    ],
  },
  {
    title: "Punteggiatura",
    items: [
      { ch: "—", name: "trattino lungo" }, { ch: "–", name: "trattino" },
      { ch: "…", name: "punti di sospensione" }, { ch: "«", name: "virgolette basse aperte" },
      { ch: "»", name: "virgolette basse chiuse" }, { ch: "“", name: "virgolette curve aperte" },
      { ch: "”", name: "virgolette curve chiuse" }, { ch: "€", name: "euro" },
      { ch: "•", name: "punto elenco" }, { ch: "→", name: "freccia" },
    ],
  },
];

interface Props {
  onPick: (ch: string) => void;
  onClose: () => void;
}

export default function CharacterPalette({ onPick, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-[min(560px,90vw)] rounded-2xl border border-card-border bg-card-bg shadow-lg p-4 max-h-[420px] overflow-y-auto"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Simboli e caratteri</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-foreground-secondary hover:text-foreground"
        >
          Chiudi ✕
        </button>
      </div>

      {SYMBOL_GROUPS.map((group) => (
        <div key={group.title} className="mb-4 last:mb-0">
          <p className="text-[11px] uppercase tracking-wide text-foreground-secondary font-medium mb-1.5">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.items.map((item, i) => (
              <button
                key={`${item.ch}-${i}`}
                type="button"
                title={item.name}
                onClick={() => onPick(item.ch)}
                className="min-w-9 h-9 px-2 rounded-lg border border-card-border bg-background text-sm hover:border-accent hover:text-accent hover:bg-tag-bg transition-colors"
              >
                {item.ch}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[11px] text-foreground-secondary mt-3 pt-3 border-t border-card-border">
        Clicca un simbolo per inserirlo nel punto del testo dove stai scrivendo.
      </p>
    </div>
  );
}
