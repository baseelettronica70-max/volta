#!/bin/bash
# ── VOLTA · Accesso ai servizi online ─────────────────────
# Esegui questo script: ti chiederà di fare il login a Turso,
# GitHub e Vercel (si aprirà il browser). Fallo una volta sola.

set -e

export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
TURSO="$HOME/.turso/turso"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   VOLTA · Login ai servizi (1 di 3)         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "→ Ti si aprirà il browser: accedi o registrati su Turso."
echo "  (puoi usare Google in un click)"
echo ""
"$TURSO" auth login
echo ""
echo "✓ Turso pronto"
echo ""

echo "╔══════════════════════════════════════════════╗"
echo "║   VOLTA · Login ai servizi (2 di 3)         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "→ Scegli 'GitHub.com' → 'HTTPS' → incolla il token"
echo "  (GitHub te lo mostra con un link diretto)"
echo ""
gh auth login --hostname github.com --git-protocol https --web
echo ""
echo "✓ GitHub pronto"
echo ""

echo "╔══════════════════════════════════════════════╗"
echo "║   VOLTA · Login ai servizi (3 di 3)         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "→ Scegli 'Login with Email' e incolla l'email"
echo "  che ti verrà inviata."
echo ""
vercel login
echo ""
echo "✓ Vercel pronto"
echo ""

echo "╔══════════════════════════════════════════════╗"
echo "║   Tutti i login completati!                 ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Ora torna su questa chat e scrivi: FATTO"
echo "e finisco io di pubblicare il sito."
echo ""
