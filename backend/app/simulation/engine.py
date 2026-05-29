import simpy
import random
from collections import defaultdict
from .models import SimulationRequest, SimulationResult, NodeResult

def run_simulation(request: SimulationRequest) -> SimulationResult:
    # Build adjacency list
    adjacency = defaultdict(list)
    for edge in request.edges:
        adjacency[edge.source].append(edge.target)

    # Build node lookup by id
    node_map = {node.id: node for node in request.nodes}

    # Find entry node (no incoming edges)
    incoming = set()
    for edge in request.edges:
        incoming.add(edge.target)
    entry_nodes = [n for n in request.nodes if n.id not in incoming]

    if not entry_nodes:
        entry_nodes = [request.nodes[0]]

    # Metrics tracking per node
    metrics = {
        node.id: {
            "latencies": [],
            "completed": 0,
            "dropped": 0,
            "queue_depth": 0,
            "max_queue": 0,
        }
        for node in request.nodes
    }

    # SimPy environment and resources
    env = simpy.Environment()
    resources = {
        node.id: simpy.Resource(env, capacity=max(1, int(node.data.capacity / 100)))
        for node in request.nodes
    }

    def process_request(env, node_id, depth=0):
        if depth > 20:
            return

        node = node_map[node_id]
        resource = resources[node_id]
        metric = metrics[node_id]

        # Track queue depth
        queue_size = len(resource.queue)
        metric["queue_depth"] = queue_size
        metric["max_queue"] = max(metric["max_queue"], queue_size)

        # Drop request if queue too deep
        if queue_size > 50:
            metric["dropped"] += 1
            return

        # Wait for resource and process
        with resource.request() as req:
            yield req
            latency = node.data.latency + random.uniform(-5, 5)
            latency = max(1, latency)
            yield env.timeout(latency)

            # Simulate error
            if random.random() < (node.data.errorRate / 100):
                metric["dropped"] += 1
                return

            metric["latencies"].append(latency)
            metric["completed"] += 1

        # Continue to next nodes
        for next_id in adjacency[node_id]:
            env.process(process_request(env, next_id, depth + 1))

    def request_generator(env):
        entry_id = entry_nodes[0].id
        interval = 1000 / request.requestsPerSecond

        for _ in range(request.requestsPerSecond * request.duration):
            env.process(process_request(env, entry_id))
            yield env.timeout(interval)

    env.process(request_generator(env))
    env.run(until=request.duration * 1000)

    # Calculate results
    node_results = []
    total_completed = 0
    total_dropped = 0

    for node in request.nodes:
        m = metrics[node.id]
        latencies = m["latencies"]
        avg_latency = sum(latencies) / len(latencies) if latencies else 0
        completed = m["completed"]
        dropped = m["dropped"]
        if node.id == entry_nodes[0].id:
            total_completed += completed
            total_dropped += dropped

        capacity_utilization = completed / max(1, request.requestsPerSecond * request.duration)
        is_bottleneck = m["max_queue"] > 10

        node_results.append(NodeResult(
            node_id=node.id,
            label=node.data.label,
            avg_latency=round(avg_latency, 2),
            throughput=round(completed / max(1, request.duration), 2),
            error_rate=round((dropped / max(1, completed + dropped)) * 100, 2),
            queue_depth=m["max_queue"],
            is_bottleneck=is_bottleneck,
        ))

    return SimulationResult(
        duration=request.duration,
        total_requests=request.requestsPerSecond * request.duration,
        completed_requests=total_completed,
        dropped_requests=total_dropped,
        nodes=node_results,
    )