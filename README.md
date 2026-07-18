# Naomi AI

> An on-device AI assistant that routes, thinks, and responds — entirely on the user's hardware.

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](.)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=java&logoColor=white)](.)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](.)
[![Android](https://img.shields.io/badge/Android-Native-3DDC84?style=flat-square&logo=android&logoColor=white)](.)
[![Status](https://img.shields.io/badge/status-Active-success?style=flat-square)](.)

**[→ Live Demo](https://genom-showcase.pages.dev/applications/naomi-ai/)** · [Portfolio](https://genom-showcase.pages.dev/)

---

## What It Is

Naomi is a fully local AI assistant running on Android. No API keys. No cloud. Every inference happens on the user's device using on-device GGUF models served through a native Java bridge to llama.cpp.

The app is structured around three independently-managed model slots:

| Slot | Model | Loaded |
|---|---|---|
| **Text** | Gemma 3 1B (GGUF) | Resident — always ready |
| **Vision** | SmolVLM2 | On-demand, unloaded after use |
| **Embedding** | nomic-embed-text | On-demand, unloaded after use |

---

## How It Works

The orchestration layer runs entirely in JavaScript. Every user message passes through an intent classifier before any model is called.

```javascript
// Intent classification — excerpt from router.js
function classifyIntent(message) {
    const lower = message.toLowerCase();
    if (/search|find|what is|who is/.test(lower))  return 'web_search';
    if (/image|photo|picture|look at/.test(lower))  return 'vision';
    if (/pdf|document|file/.test(lower))             return 'document';
    if (/\d+[\+\-\*\/]\d+|calculate/.test(lower))   return 'math';
    return 'text';
}
```

The bridge (`pipeline.js`) manages atomic load → infer → unload cycles. The native side (Java) controls RAM state; the JS side controls sequencing.

---

## Engineering Highlights

- **3-slot model manager** — text, vision, embedding slots managed independently; each loads on-demand and unloads immediately after use to stay within device RAM limits
- **Streaming inference** — token output streamed from llama.cpp JNI layer to the UI in real-time
- **Session memory with compression** — when history exceeds a token budget, the system summarizes to a permanent memory file and resets the rolling window
- **Zero cloud dependency** — model files stored on-device, all inference local

---

## Skills Demonstrated

`On-Device AI` `LLM Pipeline Engineering` `JavaScript` `Java (Android)` `Python` `llama.cpp / JNI` `Intent Classification` `Memory Management` `Native Android Development`
