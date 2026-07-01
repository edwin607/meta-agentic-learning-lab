# Meta-Agentic Learning Lab 🧠

An interactive, browser-based learning lab that **teaches Agentic AI by becoming each agent type** — live, in conversation. Built for the "Train the Trainer" program.

## 🎯 What It Does

You chat with the AI as it progressively transforms through 7 agent archetypes:

| Agent Level | What You Experience |
|-------------|-------------------|
| 🔴 **Reactive Agent** | Keyword-only replies, no memory |
| 🧠 **Memory Agent** | Short-term, long-term & episodic recall |
| 💪 **Skills Agent** | Native capabilities (summarization, etc.) |
| ♟️ **Planning Agent** | Goal decomposition & reasoning |
| 🛠️ **Tool-Using Agent** | API calls, calculators, external data |
| 🎼 **Multi-Agent System** | 3 specialized agents collaborating |
| 👁️ **Human-in-the-Loop** | Supervisory escalation & oversight |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API key
cp .env.example .env
# Edit .env with your OpenRouter API key

# 3. Start the lab
npm start

# 4. Open in browser
open http://localhost:3001
```

## 🌐 Deploy

### Render (1-click)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Push this repo to GitHub
2. Connect your GitHub account to [Render](https://render.com)
3. Create a **Web Service**, point at your repo
4. Add environment variable: `OPENROUTER_API_KEY`
5. Deploy!

### Railway (1-click)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

1. Push to GitHub
2. Connect to [Railway](https://railway.app)
3. Add `OPENROUTER_API_KEY` as a variable
4. Deploy

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | Your OpenRouter API key |
| `PORT` | No | Server port (default: 3001) |

## 📁 Project Structure

```
├── server.js                 # Express backend + OpenRouter proxy
├── meta-agentic-learning.html # Single-page interactive frontend
├── package.json
└── README.md
```

Built with ❤️ for the Train the Trainer program.
