from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.simulation.models import SimulationRequest, SimulationResult, GraphNode, GraphEdge
from app.simulation.engine import run_simulation
from app.ai_analysis import stream_analysis
from fastapi.responses import StreamingResponse
import asyncio


app = FastAPI(title="System Design Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    question: str
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    simulationResult: Optional[SimulationResult] = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/simulate", response_model=SimulationResult)
def simulate(request: SimulationRequest):
    result = run_simulation(request)
    return result

@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    async def generate():
        loop = asyncio.get_event_loop()
        chunks = await loop.run_in_executor(
            None,
            lambda: list(stream_analysis(
                request.question,
                request.nodes,
                request.edges,
                request.simulationResult
            ))
        )
        for chunk in chunks:
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")