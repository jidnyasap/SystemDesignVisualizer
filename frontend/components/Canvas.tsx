"use client"

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
} from "reactflow"
import "reactflow/dist/style.css"
import { useGraphStore } from "@/store/graphStore"

export default function Canvas() {
    const nodes = useGraphStore((state) => state.nodes)
    const edges = useGraphStore((state) => state.edges)
    const onNodesChange = useGraphStore((state) => state.onNodesChange)
    const onEdgesChange = useGraphStore((state) => state.onEdgesChange)
    const onConnect = useGraphStore((state) => state.onConnect)
    const setSelectedNode = useGraphStore((state) => state.setSelectedNode)

    return (
        <div style={{ width: "100%", height: "calc(100vh - 240px)" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                onNodeClick={(_event, node) => setSelectedNode(node.id)}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}