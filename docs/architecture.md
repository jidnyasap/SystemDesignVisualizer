# System Architecture

## Overview

System Design Visualizer is a distributed systems simulation platform. Users visually design architectures, simulate traffic and failures, and visualize bottlenecks in real time.

## High-Level Architecture

```
Browser (Next.js)
    │
    ├── Toolbar (add components)
    ├── Canvas (React Flow)
    ├── Config Panel (node properties)
    └── Results Panel (simulation metrics)
         │
         │ HTTP REST
         ▼
FastAPI Backend (port 8000)
    │
    ├── POST /simulate → SimPy Engine
    ├── POST /analyze  → Claude API
    └── GET  /health
```

## Frontend

- **Next.js 16** with App Router — server components by default, client components only where needed
- **React Flow** — interactive canvas with drag/drop, pan, zoom, connect
- **Zustand** — global state store for nodes, edges, simulation results
- **Tailwind CSS** — utility-first styling
- **localStorage** — graph persistence via Zustand persist middleware

## Backend

- **FastAPI** — async Python web framework with automatic OpenAPI docs
- **SimPy** — discrete event simulation engine for modeling request flow
- **Pydantic** — request/response validation and serialization
- **Anthropic SDK** — Claude integration for AI architecture analysis

## Data Flow

### Simulation Flow
```
User clicks "Run Simulation"
    → Zustand calls POST /simulate with nodes + edges
    → FastAPI deserializes graph via Pydantic
    → SimPy engine traverses graph via BFS
    → Each node modeled as SimPy Resource
    → Requests propagate through edges
    → Metrics collected per node
    → Results returned to frontend
    → Zustand updates store
    → Canvas re-renders with red/green nodes
    → Results table updates
```

### State Management
All application state lives in a single Zustand store:
- `nodes[]` — React Flow node objects with simulation config
- `edges[]` — connections between nodes
- `simulationResult` — latest simulation output
- `selectedNodeId` — drives config panel
- `isSimulating` — loading state for UI

## Future: AWS Architecture

```
Users
  ↓
CloudFront + S3 (frontend)
  ↓
API Gateway
  ↓
ECS Fargate (FastAPI)
  ├── RDS PostgreSQL (project persistence)
  ├── ElastiCache Redis (caching)
  └── SQS (async simulation jobs)
```
