import anthropic
import json
import os
from dotenv import load_dotenv
from app.simulation.models import SimulationResult, GraphNode, GraphEdge
from typing import Optional

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def build_prompt(
    question: str,
    nodes: list[GraphNode],
    edges: list[GraphEdge],
    simulation_result: Optional[SimulationResult]
) -> str:

    architecture = []
    for edge in edges:
        source = next((n.data.label for n in nodes if n.id == edge.source), edge.source)
        target = next((n.data.label for n in nodes if n.id == edge.target), edge.target)
        architecture.append(f"{source} → {target}")

    node_configs = []
    for node in nodes:
        node_configs.append(
            f"- {node.data.label}: latency={node.data.latency}ms, "
            f"capacity={node.data.capacity}RPS, errorRate={node.data.errorRate}%"
        )

    sim_summary = ""
    if simulation_result:
        sim_summary = f"""
Simulation Results ({simulation_result.total_requests} requests, {simulation_result.duration}s):
- Completed: {simulation_result.completed_requests}
- Dropped: {simulation_result.dropped_requests}

Per-node metrics:
"""
        for node in simulation_result.nodes:
            status = "BOTTLENECK" if node.is_bottleneck else "healthy"
            sim_summary += (
                f"- {node.label} [{status}]: "
                f"avg_latency={node.avg_latency}ms, "
                f"throughput={node.throughput}RPS, "
                f"error_rate={node.error_rate}%, "
                f"queue_depth={node.queue_depth}\n"
            )

    return f"""You are an expert distributed systems architect analyzing a system design.

Architecture:
{chr(10).join(architecture)}

Component Configuration:
{chr(10).join(node_configs)}

{sim_summary}

User Question: {question}

Provide a specific, technical analysis. Reference the actual components and metrics above.
Be concise but thorough. Use bullet points where appropriate.
Focus on actionable recommendations."""


def stream_analysis(
    question: str,
    nodes: list[GraphNode],
    edges: list[GraphEdge],
    simulation_result: Optional[SimulationResult]
):
    prompt = build_prompt(question, nodes, edges, simulation_result)

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            yield text