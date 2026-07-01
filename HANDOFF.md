# Handoff: Meta-Agentic Learning Lab

## Quick Start

```bash
npm start
# Open http://localhost:3001
```

## What It Is

An interactive, conversational learning experience that teaches high school educators (and their students) about Agentic AI — using a meta-immersive approach where the teaching interface itself embodies each concept it explains.

The learner interacts with a robot (which they name) across 8 micro-modules. Each module the robot *becomes* a different type of agent, from reactive (frustratingly limited) to multi-agent orchestration with real LLM calls.

## Architecture

```
meta-agentic-learning.html   ← Single-page frontend. Terminal-style UI, blue theme,
                                monospace font. Typing animation. Option buttons + text input.
                                Scenes are async functions in a `scenes` object.
                                Makes fetch() calls to the backend for LLM-powered scenes.

server.js                    ← Express backend. Proxies to OpenRouter API.
                                Endpoints: /api/chat, /api/plan, /api/multi-agent,
                                /api/hitl-scenario, /api/design-agent.
                                API key kept server-side only (not exposed to browser).

package.json                 ← Dependencies: express, cors. Type: module (ESM).
```

## Scenes Flow

| # | Scene | Type | LLM-powered? |
|---|-------|------|-------------|
| 1 | Welcome — name the robot | text input | No |
| 2 | Intro — what is agentic AI | options | No |
| 3 | What is an AI agent? | options | No |
| 4 | Reactive Agent demo | free text | No (scripted — intentionally frustrating) |
| 5 | Memory Agent | options | No (scripted — shows stateful memory concept) |
| 6 | Planning Agent | text → API | **Yes** — user gives goal, LLM decomposes it |
| 7 | Tool-Using Agent | options | No (scripted demo of tool concept) |
| 8 | Multi-Agent System | auto | **Yes** — 3 sub-agents each call LLM with different system prompts |
| 9 | Human-in-the-Loop | options | **Yes** — LLM generates ambiguous scenario, user decides |
| 10 | Recap | auto | No |
| 11 | Design Capstone | text → API | **Yes** — LLM analyzes user's task for agent architecture |
| 12 | Final | options | No |

## API Endpoints

All POST, JSON in/out. Base: `http://localhost:3001`

| Endpoint | Body | Returns |
|---|---|---|
| `/api/plan` | `{ task: string }` | `{ steps: string[] }` |
| `/api/multi-agent` | `{ topic: string, agentRole: string }` | `{ text: string, role: string }` |
| `/api/hitl-scenario` | `{}` | `{ scenario: string, options: string[] }` |
| `/api/design-agent` | `{ task: string }` | `{ design: string }` |
| `/api/chat` | `{ messages, system?, model?, temperature?, maxTokens? }` | `{ text: string }` |

## API Key

OpenRouter key stored in `server.js` as `OPENROUTER_API_KEY` constant.
Model used: `openai/gpt-4o-mini` (fast, cheap, sufficient for this use case).

**If key expires or runs out of credits**, replace it in `server.js:9`. The frontend has fallback behavior — it gracefully degrades to scripted content if API calls fail.

## UI Design Decisions

- Dark blue terminal aesthetic (`#0a1628` background)
- `Courier New` / monospace throughout
- Typewriter animation with per-character delay (faster on spaces, slower on punctuation)
- "thinking..." animated dots spinner during API calls (`#thinking-anim` span with interval timer)
- Option buttons as pill-shaped, appear below input area
- Progress bar at top tracks scene completion
- Connection badge (`⚡ live`) in header

## Key Files

- **`HANDOFF.md`** — this file
- **`server.js`** — Express server with OpenRouter proxy
- **`package.json`** — dependencies
- **`meta-agentic-learning.html`** — entire frontend (CSS + HTML + JS in one file)
- **`2601.21492v1.pdf`** through **`Applied Agentic AI for Organizational Transformation.pdf`** — source research papers used to define agentic AI concepts

## Things to Extend Later

- Add more agent types (e.g., a Guardian agent that audits the orchestrator)
- Add persistent session storage so a user can resume
- Add a "share results" feature that exports the conversation as a markdown reflection
- Replace hardcoded tool-demo scene with an actual LLM function-calling demo
- Add mobile-responsive breakpoints (currently desktop-first)
- Support model selection via query param (e.g., `?model=claude-3-haiku`)

## Running in Production

The server is intentionally minimal (no auth, no rate limiting, no HTTPS). If deploying:
- Add `helmet` for security headers
- Add `express-rate-limit` to prevent API abuse
- Set `OPENROUTER_API_KEY` as an environment variable instead of hardcoding
- Serve behind a reverse proxy (nginx/Caddy) for TLS

## Research Basis

Four papers in the repo were used to frame the definition of agentic AI:

- **Bandara et al. (2026)** — *A Practical Guide to Agentic AI Transition in Organizations* — defines agentic AI as "systems capable of autonomous reasoning and coordinated action across workflows"
- **Kruhse-Lehtonen & Hofmann (2026)** — *The Agent-Centric Enterprise* — "AI agents that combine LLMs with memory, planning, and tool use"
- **Westover (2025)** — *Applied Agentic AI for Organizational Transformation* — "autonomous or semi-autonomous agents capable of perceiving environments, making decisions, and executing tasks with minimal human intervention"
- **Herrmann (2025)** — *Organizational Practices and Socio-Technical Design of Human-Centered AI* — frames agentic AI within human-centered and socio-technical systems design
