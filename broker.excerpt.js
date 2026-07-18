/**
 * broker.js — Intent Router (excerpt)
 *
 * Determines what pipeline steps to build for each user message.
 * Regex-based detection — no secondary AI classifier.
 * Fast, deterministic, zero-latency overhead.
 */

// ── Search auto-detection ──────────────────────────────────────────────────────
// Fires automatically when the user message matches known search intents.
// The full tool list is much longer — this is a representative excerpt.
const SEARCH_PATTERNS = [
    /^\s*(search|look\s+up|find|google|search\s+for)/i,
    /\b(today|tonight|yesterday|tomorrow|right\s+now|currently|latest|recent|breaking)\b/i,
    /\b(who\s+is|who\s+was|when\s+is|when\s+was|where\s+is|capital\s+of|population\s+of)\b/i,
    /\b(how\s+much\s+does|how\s+many|how\s+old\s+is)\b/i,
    /\b(best|top|worst|recommended|compare|vs\.?|versus)\b/i,
    /\b(stock|crypto|bitcoin|exchange\s+rate|forex|market)\b/i,
];

// ── Math auto-detection ────────────────────────────────────────────────────────
const MATH_PATTERNS = [
    /[\d\s]+[\+\-\*\/\^%][\s\d]/,
    /\b(calculate|compute|solve|what\s+is)\b.*\d/i,
    /\b(sin|cos|tan|log|sqrt|factorial)\s*\(/i,
];

function detectIntent(text, attachedTools) {
    const hasSearchTool = attachedTools.includes('search');
    const hasMathTool   = attachedTools.includes('math');

    return {
        needsSearch: hasSearchTool || SEARCH_PATTERNS.some(p => p.test(text)),
        needsMath:   hasMathTool   || MATH_PATTERNS.some(p => p.test(text)),
        needsVision: attachedTools.includes('image'),
        needsPDF:    attachedTools.includes('pdf'),
    };
}

// The broker uses detectIntent() to assemble the correct pipeline steps,
// then hands off to pipeline.js for sequential execution.
