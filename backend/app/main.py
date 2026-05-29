from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.simulation.models import SimulationRequest, SimulationResult
from app.simulation.engine import run_simulation

app = FastAPI(title="System Design Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/simulate", response_model=SimulationResult)
def simulate(request: SimulationRequest):
    result = run_simulation(request)
    return result