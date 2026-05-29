from pydantic import BaseModel
from typing import Optional

class NodeData(BaseModel):
    label: str
    type: str
    latency: Optional[float] = 50.0
    capacity: Optional[float] = 1000.0
    errorRate: Optional[float] = 0.0

class GraphNode(BaseModel):
    id: str
    type: str
    position: dict
    data: NodeData

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str

class SimulationRequest(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    duration: Optional[int] = 60
    requestsPerSecond: Optional[int] = 100

class NodeResult(BaseModel):
    node_id: str
    label: str
    avg_latency: float
    throughput: float
    error_rate: float
    queue_depth: int
    is_bottleneck: bool

class SimulationResult(BaseModel):
    duration: int
    total_requests: int
    completed_requests: int
    dropped_requests: int
    nodes: list[NodeResult]