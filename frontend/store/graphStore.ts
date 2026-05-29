import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from "reactflow"

export type NodeResult = {
    node_id: string
    label: string
    avg_latency: number
    throughput: number
    error_rate: number
    queue_depth: number
    is_bottleneck: boolean
}

export type SimulationResult = {
    duration: number
    total_requests: number
    completed_requests: number
    dropped_requests: number
    nodes: NodeResult[]
}

type GraphState = {
    nodes: Node[]
    edges: Edge[]
    onNodesChange: (changes: NodeChange[]) => void
    onEdgesChange: (changes: EdgeChange[]) => void
    onConnect: (connection: Connection) => void
    addNode: (type: string, label: string) => void
    clearGraph: () => void
    selectedNodeId: string | null
    setSelectedNode: (id: string | null) => void
    updateNode: (id: string, data: Record<string, unknown>) => void
    simulationResult: SimulationResult | null
    isSimulating: boolean
    setSimulationResult: (result: SimulationResult | null) => void
    setIsSimulating: (value: boolean) => void
    runSimulation: () => Promise<void>
}

export const useGraphStore = create<GraphState>()(
    persist(
        (set, get) => ({
            nodes: [],
            edges: [],

            onNodesChange: (changes) =>
                set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

            onEdgesChange: (changes) =>
                set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

            onConnect: (connection) =>
                set((state) => ({ edges: addEdge(connection, state.edges) })),

            addNode: (type, label) =>
                set((state) => ({
                    nodes: [
                        ...state.nodes,
                        {
                            id: crypto.randomUUID(),
                            type: "default",
                            position: { x: Math.random() * 400, y: Math.random() * 400 },
                            data: { label, type },
                        },
                    ],
                })),

            clearGraph: () => set({ nodes: [], edges: [] }),

            selectedNodeId: null,

            setSelectedNode: (id) => set({ selectedNodeId: id }),

            updateNode: (id, data) =>
                set((state) => ({
                    nodes: state.nodes.map((node) =>
                        node.id === id
                            ? { ...node, data: { ...node.data, ...data } }
                            : node
                    ),
                })),

            simulationResult: null,

            isSimulating: false,

            setSimulationResult: (result) => set({ simulationResult: result }),

            setIsSimulating: (value) => set({ isSimulating: value }),

            runSimulation: async () => {
                const { nodes, edges, setIsSimulating, setSimulationResult } = get()
                setIsSimulating(true)
                try {
                    const response = await fetch("http://localhost:8000/simulate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nodes,
                            edges,
                            duration: 10,
                            requestsPerSecond: 100,
                        }),
                    })
                    const result = await response.json()
                    setSimulationResult(result)
                } catch (error) {
                    console.error("Simulation failed:", error)
                } finally {
                    setIsSimulating(false)
                }
            },
        }),
        {
            name: "graph-storage",
        }
    )
)