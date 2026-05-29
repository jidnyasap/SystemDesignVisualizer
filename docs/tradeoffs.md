# Technical Tradeoffs

## Python FastAPI vs Go

**Chose: Python FastAPI**

Go would produce a stronger signal for infrastructure companies and has better concurrency primitives for the simulation engine (goroutines vs SimPy). However, Python was chosen because:

- SimPy is a mature Python-native discrete event simulation library
- Faster iteration speed for a portfolio project
- FastAPI matches Go's performance characteristics for this use case
- Anthropic's Python SDK is first-class

**Tradeoff:** Slower raw performance, weaker infra signal. Acceptable for portfolio.

---

## Zustand vs Redux

**Chose: Zustand**

Redux would provide more structure and better DevTools for large applications. Zustand was chosen because:

- Minimal boilerplate — store defined in ~50 lines
- Built-in `persist` middleware handles localStorage with zero config
- Selective subscriptions prevent unnecessary re-renders
- Sufficient for this application's complexity

**Tradeoff:** Less structure means easier to misuse at scale. Redux would be better for a large team.

---

## localStorage vs Backend Persistence

**Chose: localStorage (for now)**

Backend persistence (PostgreSQL) is the correct long-term solution — it enables multi-device sync, sharing, and project history. localStorage was chosen initially because:

- Keeps Phase 1 self-contained — no database dependency
- Zero infrastructure needed for local development
- Zustand `persist` middleware makes it transparent

**Tradeoff:** Data tied to one browser. Clearing cache loses work. Planned migration to PostgreSQL in Phase 5.

---

## SimPy vs Custom Engine

**Chose: SimPy**

A custom engine would give full control over the simulation model and avoid SimPy's Python 3.9 async compatibility issues. SimPy was chosen because:

- Battle-tested discrete event simulation semantics
- Resource + Process model maps naturally to distributed systems
- Faster to build correctly than a custom scheduler

**Tradeoff:** SimPy is synchronous, requiring thread pool execution in FastAPI. A custom async engine would integrate more cleanly.

---

## REST vs WebSockets for Simulation

**Chose: REST (initially)**

WebSockets would enable real-time streaming of simulation metrics as they're generated — showing queue depth rising in real time. REST was chosen first because:

- Simpler to implement and debug
- Sufficient for batch simulation results
- WebSocket streaming planned for Phase 3

**Tradeoff:** No live simulation updates. User waits for full result. Acceptable for current scope.

---

## React Flow vs D3.js

**Chose: React Flow**

D3.js would give complete control over rendering and enable more sophisticated visualizations. React Flow was chosen because:

- Built-in drag/drop, pan, zoom, connect — weeks of work for free
- React-native component model fits the stack
- Custom node components provide sufficient flexibility

**Tradeoff:** Less control over rendering. D3 would be better for complex data visualizations like the metrics charts in Phase 3.
