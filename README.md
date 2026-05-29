# System Design Visualizer

A distributed systems simulation platform. Visually design architectures, simulate traffic and failures, and identify bottlenecks in real time — with AI-powered analysis powered by Claude.

> Built with Claude Code and AI-assisted development tooling across the full stack.

---

## What It Does

Design any distributed system visually, configure latency and capacity per component, then simulate real traffic through it. Bottleneck nodes turn red automatically. Healthy nodes turn green.

**Key features:**

- Drag-and-drop AWS architecture components onto an interactive canvas
- Connect components to model real request flows
- Configure latency, capacity, and error rate per node
- Run discrete event simulation at configurable RPS
- Automatic bottleneck detection — nodes highlight red when overwhelmed
- Per-node metrics: avg latency, throughput, error rate, queue depth
- AI-assisted architecture analysis powered by Claude (Anthropic API)
- Persists your work automatically via localStorage

---

## Demo

### Architecture Canvas + Simulation Results

After running a simulation at 100 RPS, PostgreSQL is flagged as the bottleneck (119ms latency, only 8.3 RPS throughput against 100 RPS incoming). All upstream nodes are healthy.

```
Client → API Gateway → Load Balancer → Service → PostgreSQL (bottleneck 🔴)
                                      → Redis   (healthy 🟢)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Canvas | React Flow |
| State | Zustand + persist middleware |
| Backend | Python FastAPI |
| Simulation | SimPy (discrete event simulation) |
| AI Analysis | Anthropic Claude API (claude-sonnet) |
| Infrastructure | AWS ECS Fargate, RDS PostgreSQL, ElastiCache Redis |

---

## How the Simulation Works

The engine models each node as a SimPy `Resource` with configurable capacity and latency. Requests are generated at the specified RPS and propagate through the graph via BFS traversal.

**Bottleneck detection** uses queue depth — a node is flagged when more than 10 requests are waiting. This directly models real-world conditions: connection pool exhaustion, database overload, saturated services.

**Little's Law** gives the theoretical max throughput for any node:

```
max_throughput = (capacity / 100) / (latency_seconds)
```

Example: PostgreSQL with `capacity=150`, `latency=120ms` → max **12.5 RPS**. At 100 RPS incoming, it falls behind immediately.

See [`docs/simulation-model.md`](docs/simulation-model.md) for full details.

---

## Architecture

```
Browser (Next.js)
    │
    ├── Toolbar       — add components
    ├── Canvas        — React Flow interactive canvas
    ├── Config Panel  — per-node latency/capacity/error config
    └── Results Panel — simulation metrics table
         │
         │  HTTP REST
         ▼
FastAPI Backend (port 8000)
    ├── POST /simulate  → SimPy engine
    └── POST /analyze   → Claude API (streaming)
```

See [`docs/architecture.md`](docs/architecture.md) for full system design.

---

## Running Locally

### Prerequisites

- Node.js 18+ — install via `nvm install --lts`
- Python 3.9+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Runs on http://localhost:8000  
Interactive API docs: http://localhost:8000/docs

### Environment

```bash
# backend/.env
ANTHROPIC_API_KEY=your_key_here
```

---

## Project Structure

```
SystemDesignVisualizer/
  frontend/
    app/              # Next.js App Router pages
    components/       # Canvas, Toolbar, ConfigPanel, ResultsPanel, SystemNode
    store/            # Zustand graph store
  backend/
    app/
      main.py         # FastAPI routes
      ai_analysis.py  # Claude streaming integration
      simulation/
        engine.py     # SimPy discrete event engine
        models.py     # Pydantic request/response models
  docs/
    architecture.md   # System design
    simulation-model.md  # How the simulation works
    tradeoffs.md      # Technical decisions and tradeoffs
```

---

## Docs

- [Architecture](docs/architecture.md) — system design and data flow
- [Simulation Model](docs/simulation-model.md) — discrete event simulation, Little's Law, bottleneck detection
- [Technical Tradeoffs](docs/tradeoffs.md) — Python vs Go, Zustand vs Redux, SimPy vs custom engine, and more

---

## Roadmap

- [x] Phase 1 — Visual editor (drag/drop, connect, persist)
- [x] Phase 2 — Simulation engine (SimPy, BFS, bottleneck detection)
- [x] Phase 3 — Results visualization (inline metrics, results table)
- [x] Phase 4 — AI analysis backend (Claude streaming endpoint)
- [ ] Phase 4 — AI chat panel frontend
- [ ] Phase 5 — AWS deployment (ECS Fargate, RDS, ElastiCache, Terraform)
- [ ] Phase 6 — Simulation config controls (RPS slider, duration)
