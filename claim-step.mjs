import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DB_DIR = path.join(os.homedir(), ".openclaw", "antfarm");
const DB_PATH = path.join(DB_DIR, "antfarm.db");

fs.mkdirSync(DB_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);

// Claim a step for the feature-dev-developer agent
const agentId = "feature-dev-developer";

// Find pending step
const step = db.prepare(`SELECT s.id, s.step_id, s.run_id, s.input_template, s.type, s.loop_config
     FROM steps s
     JOIN runs r ON r.id = s.run_id
     WHERE s.agent_id = ? AND s.status = 'pending'
       AND r.status NOT IN ('failed', 'cancelled')
     LIMIT 1`).get(agentId);

if (!step) {
    console.log(JSON.stringify({ found: false }));
    process.exit(0);
}

// Get run context
const run = db.prepare("SELECT context FROM runs WHERE id = ?").get(step.run_id);
const context = run ? JSON.parse(run.context) : {};
context["run_id"] = step.run_id;

// Simple template resolution
function resolveTemplate(template, context) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_match, key) => {
        if (key in context) return context[key];
        const lower = key.toLowerCase();
        if (lower in context) return context[lower];
        return `[missing: ${key}]`;
    });
}

// Mark as running
db.prepare("UPDATE steps SET status = 'running', updated_at = datetime('now') WHERE id = ? AND status = 'pending'").run(step.id);

const resolvedInput = resolveTemplate(step.input_template, context);
console.log(JSON.stringify({ found: true, stepId: step.id, runId: step.run_id, resolvedInput }));
