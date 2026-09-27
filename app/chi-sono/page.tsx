import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi sono",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Chi sono</h1>

      <div className="space-y-6 text-foreground-secondary leading-relaxed text-lg">
        <p>
          Ciao, sono <strong className="text-foreground">Gabriele</strong> e
          questo è il mio progetto dedicato all&apos;elettronica. Amo
          smontare le cose per capire come funzionano, costruire circuiti e
          condividere tutto quello che imparo.
        </p>

        <p>
          Ho creato <strong className="text-foreground">VOLTA</strong> perché
          credo che l&apos;elettronica sia una delle discipline più
          affascinanti e accessibili che esistono. Non serve una laurea in
          ingegneria: basta un po&apos; di curiosità, un multimetro e
          l&apos;atto di provare.
        </p>

        <p>
          Qui troverai tutorial passo-passo, guide pratiche, recensioni di
          strumenti e consigli che avrei voluto avere quando ho iniziato.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
          Cosa trovi qui
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Tutorial per principianti</strong> —
            dalla breadboard al primo programma su Arduino/ESP32
          </li>
          <li>
            <strong className="text-foreground">Guide tecniche</strong> —
            codici colore, saldatura, letture di multimetro
          </li>
          <li>
            <strong className="text-foreground">Progetti pratici</strong> —
            amplificatori, sensori, domotica
          </li>
          <li>
            <strong className="text-foreground">Consigli strumenti</strong> —
            multimetri, saldatori, oscilloscopi
          </li>
        </ul>

        <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
          Contatti
        </h2>

        <p>
          Vuoi collaborare, hai un&apos;idea per un tutorial o vuoi semplicemente
          dire ciao? Scrivimi!
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
