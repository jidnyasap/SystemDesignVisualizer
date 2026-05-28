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

type GraphState = {
    nodes: Node[]
    edges: Edge[]
    onNodesChange: (changes: NodeChange[]) => void
    onEdgesChange: (changes: EdgeChange[]) => void
    onConnect: (connection: Connection) => void
    addNode: (type: string, label: string) => void
}

export const useGraphStore = create<GraphState>()(
    persist(
        (set) => ({
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
        }),
        {
            name: "graph-storage",
        }
    )
)