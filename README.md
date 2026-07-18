# Naomi AI

> An on-device AI assistant that routes, thinks, and responds — entirely on the user's hardware.

[![Stack](https://img.shields.io/badge/stack-JavaScript_%7C_Vite-f7df1e?style=flat-square)](.)
[![Runtime](https://img.shields.io/badge/runtime-Genom_(Proprietary)-blueviolet?style=flat-square)](.)
[![Models](https://img.shields.io/badge/models-Gemma_3_1B_%7C_SmolVLM2_%7C_nomic--embed-3DDC84?style=flat-square)](.)
[![Status](https://img.shields.io/badge/status-Active-success?style=flat-square)](.)

---

## What It Is

Naomi is a fully local AI assistant running on Android. No API keys. No cloud. Every inference happens on the user's device using on-device GGUF models.

The app is structured around three independently-managed model slots:

| Slot | Model | Loaded |
|---|---|---|
| **Text** | Gemma 3 1B (GGUF) | Resident — always ready |
| **Vision** | SmolVLM2-500M (GGUF) | On-demand, unloaded after use |
| **Embedding** | nomic-embed-text | On-demand, unloaded after use |

This keeps RAM usage within device limits without sacrificing capability.

---

## What It Solves

Running multiple AI models on a phone is a memory management problem. Most apps force you to pick one model. Naomi uses a **3-slot architecture** where each slot loads independently and is immediately evicted after the response is complete — so the user always has text, vision, and semantic search available without crashing.

---

## How Routing Works

Naomi doesn't ask the user to pick a tool. It figures it out automatically.

The broker (`broker.js`) uses regex-based pattern matching on every incoming message to decide what pipeline steps to build:

```javascript
// Auto-detect search intent — no user selection required
const SEARCH_PATTERNS = [
    /^\s*(search|look\s+up|find|google)/i,
    /\b(today|tonight|breaking|latest|just\s+released)\b/i,
    /\b(who\s+is|when\s+was|capital\s+of|population\s+of)\b/i,
    // ... 20+ more patterns
];

// Auto-detect math
const MATH_PATTERNS = [
    /[\d\s]+[\+\-\*\/\^%][\s\d]/,
    /\b(calculate|compute|solve|what\s+is)\b.*\d/i,
];
```

If a user drags in a PDF, image, or file — the broker detects the attachment type and routes to the correct tool automatically. **Zero user configuration.**

---

## Technical Highlights

- **Sequential pipeline engine** — `pipeline.js` runs tool calls in order, passing context forward between steps (vision → search → generate, or any combination)
- **Regex-based intent detection** — no secondary classifier model; fast, deterministic, zero latency overhead
- **Per-slot model lifecycle** — `models.js` handles load/unload with native calls; eviction is immediate after each inference
- **Persistent memory** — `memory.js` stores tagged facts across sessions, injected into context on relevant queries
- **Native tool bridge** — file reads, web search, PDF parsing, math eval all go through the Genom native API layer — no server, no network dependency for local tools

---

## Stack

`JavaScript` · `Vite` · `llama.rn (via Genom native bridge)` · `Genom Runtime`

---

## Screenshots

→ [View full app showcase on the portfolio landing page](https://axmohamedsoliman-lgtm.github.io/Genom-framework-profile-landing-page/)

---

*Full source is private. This repo contains architecture overview and curated implementation snippets.*
