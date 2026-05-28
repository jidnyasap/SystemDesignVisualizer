# System Design Visualizer

A distributed systems design and simulation platform. Visually design architectures, simulate traffic and failures, and get AI-powered analysis of your system.

## What This Project Does

- Drag-and-drop architecture components (API Gateway, Load Balancer, Database, etc.)
- Connect components to design system topologies
- Simulate traffic, failures, retries, and bottlenecks
- Visualize real-time metrics (latency, queue depth, error rates)
- AI-assisted architecture review powered by Claude

## Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS, React Flow, Zustand  
**Backend:** Python FastAPI, Pydantic  
**Infrastructure:** AWS (ECS Fargate, RDS, ElastiCache, SQS), Terraform

## Running Locally

### Prerequisites

- Node.js 18+ (install via nvm: `nvm install --lts`)
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
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Runs on http://localhost:8000  
API docs available at http://localhost:8000/docs

### Both servers must be running for the full app to work.
