# Simulation Model

## Overview

The simulation engine models distributed systems as directed graphs where nodes are services and edges are request paths. It uses **discrete event simulation** via SimPy to model request flow, queueing, and failures.

## Discrete Event Simulation

Unlike continuous simulation (time advances in fixed steps), discrete event simulation advances time by jumping from event to event:

- Request arrives at t=0ms
- Request finishes processing at t=50ms
- Request arrives at next node at t=52ms

SimPy manages this event queue automatically.

## Graph Traversal

The engine uses **BFS (Breadth-First Search)** to traverse the architecture graph:

1. Build adjacency list from edges
2. Find entry node (no incoming edges)
3. For each request, spawn a SimPy process starting at entry node
4. Each process follows edges to downstream nodes recursively

## Node Modeling

Each node is modeled as a SimPy `Resource`:

```python
resource = simpy.Resource(env, capacity=node.capacity / 100)
```

When a request arrives:
1. Request joins the resource queue
2. Waits until capacity is available (`yield req`)
3. Processes for `latency ± jitter` milliseconds (`yield env.timeout(latency)`)
4. Error check based on `errorRate`
5. Spawns downstream requests

## Bottleneck Detection

A node is a bottleneck when `queue_depth > 10`.

Queue depth measures how many requests are waiting for the resource. A deep queue means requests are arriving faster than the node can process them.

## Little's Law

The theoretical max throughput of any node:

```
max_throughput = (capacity / 100) / (latency / 1000)
```

Example: PostgreSQL with capacity=200, latency=100ms:
```
max_throughput = 2 / 0.1 = 20 RPS
```

If incoming traffic exceeds this, the queue grows unboundedly until requests drop.

## Backpressure

When queue depth exceeds 50, new requests are dropped immediately. This models real-world backpressure — connection pool exhaustion, queue size limits, circuit breakers.

## Traffic Generation

Requests arrive at evenly-spaced intervals:
```
interval = 1000ms / requestsPerSecond
```

Total requests = RPS × duration seconds.

## Limitations

- Simplified concurrency model (capacity/100 workers)
- Uniform traffic arrival (real traffic is bursty/Poisson)
- No retry modeling yet
- No circuit breaker simulation yet
- Bidirectional edges not supported (depth guard prevents infinite loops)
