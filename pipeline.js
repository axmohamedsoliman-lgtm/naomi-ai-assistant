/**
 * pipeline.js — Sequential Execution Engine
 *
 * The broker builds an ordered list of steps (tool calls).
 * The pipeline runs them one by one, passing results forward.
 * Live status updates go to the UI via registered callbacks.
 *
 * Usage:
 *   const p = pipeline.create([
 *     { id: 'vision', label: 'Reading image…',     fn: (ctx) => runVision(ctx) },
 *     { id: 'search', label: 'Searching the web…', fn: (ctx) => runSearch(ctx) },
 *     { id: 'think',  label: 'Thinking…',          fn: (ctx) => runGenerate(ctx) },
 *   ]);
 *   const finalCtx = await p.run(initialContext);
 */

class Pipeline {
    constructor(steps) {
        this._steps    = steps;     // [{ id, label, fn }]
        this._aborted  = false;
        this._onStatus = null;      // (label) => void — called per step
        this._onError  = null;      // (err) => void
    }

    /** Register a status callback — called with each step's label as it starts. */
    onStatus(cb) { this._onStatus = cb; return this; }

    /** Register an error callback. */
    onError(cb)  { this._onError  = cb; return this; }

    /** Abort execution after the current step completes. */
    abort() { this._aborted = true; }

    /**
     * Execute all steps in sequence.
     * Each step receives the shared context object and can add to it.
     * @param {object} [initialCtx] - seed context passed to step 0
     * @returns {Promise<object>} final context after all steps
     */
    async run(initialCtx = {}) {
        const ctx = { ...initialCtx, _results: {} };

        for (const step of this._steps) {
            if (this._aborted) break;

            this._onStatus?.(step.label);

            try {
                const result = await step.fn(ctx);
                if (result !== undefined) {
                    ctx._results[step.id] = result;
                    if (result && typeof result === 'object' && !Array.isArray(result)) {
                        Object.assign(ctx, result);
                    }
                }
            } catch (err) {
                console.error(`[Pipeline] Step "${step.id}" failed:`, err.message);
                this._onError?.(err, step.id);
                if (step.id === 'think') throw err; // generation failure is fatal
                ctx._results[step.id] = { error: err.message };
            }
        }

        return ctx;
    }
}

export const pipeline = {
    create(steps) {
        return new Pipeline(steps);
    },
};
