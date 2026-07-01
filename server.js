import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function callOpenRouter(messages, system, options = {}) {
  const model = options.model || 'openai/gpt-4o-mini';
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens || 1000;

  const body = {
    model,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ],
    temperature,
    max_tokens: maxTokens,
  };

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': `http://localhost:${PORT}`,
      'X-Title': 'Meta-Agentic Learning Lab',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenRouter ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  return data.choices[0].message.content;
}

// ── API Endpoints ─────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system, model, temperature, maxTokens } = req.body;
    const text = await callOpenRouter(
      messages || [],
      system || 'You are a helpful AI learning companion.',
      { model, temperature, maxTokens }
    );
    res.json({ text });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/plan', async (req, res) => {
  try {
    const { task } = req.body;
    const system = `You are a planning AI. Decompose the user's goal into clear, actionable steps.
Output ONLY a JSON array of 4-6 step strings. No other text, no markdown wrappers.
Example: ["Step 1: Define objectives", "Step 2: Gather materials", "Step 3: Execute plan"]`;
    const text = await callOpenRouter(
      [{ role: 'user', content: `Decompose this goal into steps: ${task}` }],
      system,
      { model: 'openai/gpt-4o-mini', temperature: 0.4, maxTokens: 800 }
    );
    const cleaned = text.replace(/```json|```/g, '').trim();
    let steps;
    try {
      steps = JSON.parse(cleaned);
    } catch {
      steps = cleaned.split('\n').filter(l => l.trim()).map(l => l.replace(/^\d+[\.\)]\s*/, ''));
    }
    res.json({ steps: Array.isArray(steps) ? steps : [text] });
  } catch (err) {
    console.error('Plan error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/multi-agent', async (req, res) => {
  try {
    const { topic, agentRole } = req.body;

    const systemPrompts = {
      researcher: `You are a RESEARCHER agent. Given a topic, provide 2-3 concise bullet points of key information. Be factual and precise. Max 80 words.`,
      explainer: `You are an EXPLAINER agent. Given a topic, simplify it for a high school student. Use analogies. Max 80 words.`,
      quizmaster: `You are a QUIZ MASTER agent. Given a topic, generate a single short quiz question (multiple choice) to test understanding, with the correct answer marked. Max 60 words.`,
    };

    const prompt = agentRole
      ? systemPrompts[agentRole] || systemPrompts.explainer
      : `You are an agent specialized in the role "${agentRole || 'general'}". Respond concisely.`;

    const text = await callOpenRouter(
      [{ role: 'user', content: `Topic: ${topic || 'Agentic AI'}\nProvide your specialized response.` }],
      prompt,
      { model: 'openai/gpt-4o-mini', temperature: 0.5, maxTokens: 300 }
    );

    res.json({ text, role: agentRole || 'assistant' });
  } catch (err) {
    console.error('Multi-agent error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hitl-scenario', async (req, res) => {
  try {
    const system = `You are a scenario generator for a human-in-the-loop demonstration.
Generate a brief (1-2 sentence) ambiguous business scenario where an AI agent is uncertain and needs human judgment.
Output ONLY the scenario text, no meta-commentary.`;
    const text = await callOpenRouter(
      [{ role: 'user', content: 'Generate a scenario where an AI agent encounters an ambiguous situation and must escalate to a human for a decision. Make it realistic and specific.' }],
      system,
      { model: 'openai/gpt-4o-mini', temperature: 0.8, maxTokens: 200 }
    );
    const options = [
      'A) Proceed with the automated default',
      'B) Pause and request more data',
      'C) Escalate to a human supervisor',
    ];
    res.json({ scenario: text, options });
  } catch (err) {
    console.error('HITL error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/design-agent', async (req, res) => {
  try {
    const { task } = req.body;
    const system = `You are an AI architect. Given a user's task, suggest what kind of agent would handle it well.
Output exactly 4 short lines, each starting with an emoji:
📡 Information needed:
🔧 Tools required:
👤 Human oversight:
🧠 Memory/context:
Keep each line under 60 characters after the label.`;
    const text = await callOpenRouter(
      [{ role: 'user', content: `Design an AI agent for this task: ${task}` }],
      system,
      { model: 'openai/gpt-4o-mini', temperature: 0.5, maxTokens: 400 }
    );
    res.json({ design: text });
  } catch (err) {
    console.error('Design error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Serve static files ────────────────────────────────────────

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'meta-agentic-learning.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🤖 Meta-Agentic Learning Lab running`);
  console.log(`  ─────────────────────────────`);
  console.log(`  → http://localhost:${PORT}\n`);
});
