"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import CharacterPalette from "./CharacterPalette";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type BlockCmd =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "blockquote"
  | "pre";

type StyleCmd =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "removeFormat";

interface Btn {
  icon: string;
  title: string;
  cmd?: StyleCmd;
  block?: BlockCmd;
  action?: "link" | "image" | "table" | "hr" | "undo" | "redo" | "clear";
}

const GROUPS: Btn[][] = [
  [
    { icon: "undo", title: "Annulla (Ctrl+Z)", action: "undo" },
    { icon: "redo", title: "Ripeti (Ctrl+Y)", action: "redo" },
  ],
  [
    { icon: "h1", title: "Titolo grande", block: "h1" },
    { icon: "h2", title: "Titolo medio", block: "h2" },
    { icon: "h3", title: "Titolo piccolo", block: "h3" },
    { icon: "p", title: "Paragrafo normale", block: "p" },
  ],
  [
    { icon: "bold", title: "Grassetto (Ctrl+B)", cmd: "bold" },
    { icon: "italic", title: "Corsivo (Ctrl+I)", cmd: "italic" },
    { icon: "underline", title: "Sottolineato (Ctrl+U)", cmd: "underline" },
    { icon: "strike", title: "Barrato", cmd: "strikeThrough" },
    { icon: "clear", title: "Togli tutta la formattazione", action: "clear" },
  ],
  [
    { icon: "ul", title: "Elenco puntato", cmd: "insertUnorderedList" },
    { icon: "ol", title: "Elenco numerato", cmd: "insertOrderedList" },
    { icon: "quote", title: "Citazione", block: "blockquote" },
  ],
  [
    { icon: "alignLeft", title: "Allinea a sinistra", cmd: "justifyLeft" },
    { icon: "alignCenter", title: "Centra", cmd: "justifyCenter" },
    { icon: "alignRight", title: "Allinea a destra", cmd: "justifyRight" },
  ],
  [
    { icon: "link", title: "Inserisci link", action: "link" },
    { icon: "image", title: "Inserisci immagine", action: "image" },
    { icon: "table", title: "Inserisci tabella", action: "table" },
    { icon: "code", title: "Codice", block: "pre" },
    { icon: "hr", title: "Linea separatrice", action: "hr" },
  ],
];

const STYLE_KEYS: StyleCmd[] = [
  "bold", "italic", "underline", "strikeThrough",
  "insertUnorderedList", "insertOrderedList",
  "justifyLeft", "justifyCenter", "justifyRight",
];

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);
  const savedRange = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [block, setBlock] = useState<string>("p");
  const [stats, setStats] = useState({ words: 0, chars: 0, time: 0 });
  const [showSymbols, setShowSymbols] = useState(false);
  const [focused, setFocused] = useState(false);

  // ── Sincronizza il contenuto solo quando cambia davvero (caricamento articolo) ──
  const updateStats = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const text = el.innerText.replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;
    setStats({
      words,
      chars: text.length,
      time: Math.max(1, Math.round(words / 200)),
    });
  }, []);

  const refreshState = useCallback(() => {
    const next: Record<string, boolean> = {};
    for (const k of STYLE_KEYS) {
      try {
        next[k] = document.queryCommandState(k);
      } catch {
        next[k] = false;
      }
    }
    setActive(next);
    try {
      const b = document.queryCommandValue("formatBlock");
      setBlock((b || "p").toLowerCase());
    } catch {
      /* noop */
    }
  }, []);

  const emit = useCallback(() => {
    const html = ref.current?.innerHTML ?? "";
    lastHtml.current = html;
    onChange(html);
    updateStats();
    refreshState();
  }, [onChange, refreshState, updateStats]);

  // ── Sincronizza il contenuto solo quando cambia davvero (caricamento articolo) ──
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value !== lastHtml.current) {
      el.innerHTML = value || "";
      lastHtml.current = value || "";
      updateStats();
    }
  }, [updateStats, value]);

  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode ?? null)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreRange = useCallback(() => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }, []);

  const focus = useCallback(() => {
    ref.current?.focus();
    restoreRange();
  }, [restoreRange]);

  // ── Esecuzione comandi ──
  const exec = useCallback(
    (cmd: string, val?: string) => {
      focus();
      document.execCommand(cmd, false, val);
      emit();
    },
    [emit, focus]
  );

  const insertHtml = useCallback(
    (html: string) => {
      focus();
      document.execCommand("insertHTML", false, html);
      emit();
    },
    [emit, focus]
  );

  const insertText = useCallback(
    (text: string) => {
      focus();
      document.execCommand("insertText", false, text);
      emit();
    },
    [emit, focus]
  );

  // ── Azioni con dialogo ──
  const wrapSelection = useCallback(
    (html: string) => {
      const sel = window.getSelection();
      const text = sel?.toString() ?? "";
      if (text) {
        exec("insertHTML", `<span style="color:${html}">${text}</span>`);
      } else {
        // nessuna selezione: applica al blocco corrente
        const el = ref.current?.querySelector("p, h1, h2, h3, h4, li, blockquote");
        if (el instanceof HTMLElement) {
          el.style.color = html;
          emit();
        }
      }
    },
    [emit, exec]
  );

  const onAction = (action: NonNullable<Btn["action"]>) => {
    switch (action) {
      case "link": {
        const url = prompt("Indirizzo del link (con https://)", "https://");
        if (!url || url === "https://") return;
        exec("createLink", url);
        return;
      }
      case "image": {
        const url = prompt("Indirizzo internet dell'immagine (con https://)", "https://");
        if (!url || !url.startsWith("http")) return;
        const w = prompt("Larghezza in pixel (lascia vuoto per automatico)", "800");
        const style = w && /^\d+$/.test(w) ? ` style="width:${w}px;height:auto"` : "";
        insertHtml(`<img src="${url}" alt=""${style}>`);
        return;
      }
      case "table": {
        const rows = prompt("Quante righe vuoi nella tabella? (compreso l'intestazione)", "3");
        const cols = prompt("Quante colonne?", "3");
        const r = Math.min(20, Math.max(1, parseInt(rows || "3", 10) || 3));
        const c = Math.min(10, Math.max(1, parseInt(cols || "3", 10) || 3));
        let html = "<table><thead><tr>";
        for (let i = 0; i < c; i++) html += "<th>Intestazione</th>";
        html += "</tr></thead><tbody>";
        for (let i = 1; i < r; i++) {
          html += "<tr>";
          for (let j = 0; j < c; j++) html += "<td>Cella</td>";
          html += "</tr>";
        }
        html += "</tbody></table><p><br></p>";
        insertHtml(html);
        return;
      }
      case "hr":
        insertHtml("<hr><p><br></p>");
        return;
      case "undo":
        exec("undo");
        return;
      case "redo":
        exec("redo");
        return;
      case "clear":
        exec("selectAll");
        exec("removeFormat");
        return;
    }
  };

  // ── scorciatoie tastiera ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ref.current?.contains(document.activeElement)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const key = e.key.toLowerCase();
      const map: Record<string, () => void> = {
        b: () => exec("bold"),
        i: () => exec("italic"),
        u: () => exec("underline"),
        h: () => exec("formatBlock", "<h2>"),
        p: () => exec("formatBlock", "<p>"),
      };

      if (key === "s") {
        e.preventDefault();
        exec("insertUnorderedList");
        return;
      }
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        exec("redo");
        return;
      }
      if (key === "z") {
        e.preventDefault();
        exec("undo");
        return;
      }
      if (map[key]) {
        e.preventDefault();
        map[key]();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [exec]);

  // ── Ctrl/Cmd+Shift+V incolla come testo semplice ──
  const onPaste = (e: React.ClipboardEvent) => {
    const native = e.nativeEvent as unknown as {
      ctrlKey?: boolean;
      metaKey?: boolean;
      shiftKey?: boolean;
    };
    if (!native.shiftKey || (!native.ctrlKey && !native.metaKey)) return;
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  const btnClass = (isOn: boolean) =>
    `flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0 ${
      isOn
        ? "bg-accent text-white"
        : "text-foreground hover:bg-background-secondary"
    }`;

  return (
    <div className="rounded-xl border border-border bg-card-bg overflow-hidden">
      {/* ── Barra strumenti ── */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-card-border bg-background-secondary/60">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="w-px h-5 mx-1 bg-border" />}
            {group.map((b) => {
              const isOn = b.cmd
                ? active[b.cmd]
                : b.block
                  ? block === b.block
                  : false;
              return (
                <button
                  key={b.icon + (b.cmd ?? b.block ?? b.action)}
                  type="button"
                  title={b.title}
                  aria-label={b.title}
                  aria-pressed={!!isOn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (b.cmd) exec(b.cmd);
                    else if (b.block) exec("formatBlock", `<${b.block}>`);
                    else if (b.action) onAction(b.action);
                  }}
                  className={btnClass(!!isOn)}
                >
                  <Icon name={b.icon} />
                </button>
              );
            })}
          </div>
        ))}

        <span className="w-px h-5 mx-1 bg-border" />

        {/* Colore testo */}
        <div className="relative flex items-center">
          <button
            type="button"
            title="Colore del testo"
            aria-label="Colore del testo"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => wrapSelection("#ff3b30")}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <span
              className="w-4 h-4 rounded-sm border border-border"
              style={{ background: "linear-gradient(135deg,#ff3b30 0 33%,#34c759 33% 66%,#0071e3 66%)" }}
            />
          </button>
        </div>

        {/* Evidenziatore */}
        <button
          type="button"
          title="Evidenzia il testo selezionato"
          aria-label="Evidenzia"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const sel = window.getSelection()?.toString() ?? "";
            if (sel) exec("insertHTML", `<mark>${sel}</mark>`);
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-background-secondary transition-colors"
        >
          <span className="w-4 h-4 rounded-sm bg-yellow-300/80 border border-border" />
        </button>

        {/* Simboli */}
        <div className="relative">
          <button
            type="button"
            title="Simboli e caratteri speciali"
            aria-label="Simboli"
            aria-expanded={showSymbols}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowSymbols((v) => !v)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              showSymbols ? "bg-accent text-white" : "text-foreground hover:bg-background-secondary"
            }`}
          >
            <Icon name="symbols" />
          </button>
          {showSymbols && (
            <CharacterPalette onPick={insertText} onClose={() => setShowSymbols(false)} />
          )}
        </div>
      </div>

      {/* ── Area di scrittura ── */}
      <div className="relative">
        {!focused && !value && (
          <p className="absolute top-5 left-5 text-sm text-foreground-secondary/70 pointer-events-none select-none">
            {placeholder ?? "Scrivi il tuo articolo qui…"}
          </p>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Contenuto dell'articolo"
          onInput={emit}
          onBlur={() => {
            setFocused(false);
            saveRange();
          }}
          onFocus={() => {
            setFocused(true);
            refreshState();
          }}
          onKeyUp={refreshState}
          onMouseUp={refreshState}
          onPaste={onPaste}
          className="prose-apple min-h-[420px] max-h-[70vh] overflow-y-auto px-5 py-4 focus:outline-none"
          style={{ cursor: "text" }}
        />
      </div>

      {/* ── Barra di stato ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-card-border bg-background-secondary/60 text-[11px] text-foreground-secondary">
        <span>
          {stats.words} {stats.words === 1 ? "parola" : "parole"} · {stats.chars}{" "}
          caratteri · ~{stats.time} min di lettura
        </span>
        <span className="hidden sm:inline">
          Ctrl+B grassetto · Ctrl+I corsivo · Ctrl+U sottolineato
        </span>
      </div>
    </div>
  );
}
