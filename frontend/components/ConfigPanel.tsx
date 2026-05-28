"use client"

import { useGraphStore } from "@/store/graphStore"

export default function ConfigPanel() {
    const nodes = useGraphStore((state) => state.nodes)
    const selectedNodeId = useGraphStore((state) => state.selectedNodeId)
    const setSelectedNode = useGraphStore((state) => state.setSelectedNode)
    const updateNode = useGraphStore((state) => state.updateNode)

    const selectedNode = nodes.find((n) => n.id === selectedNodeId)

    if (!selectedNode) {
        return (
            <div className="w-64 h-screen bg-gray-900 text-gray-400 p-4 flex items-center justify-center text-sm">
                Click a node to configure it
            </div>
        )
    }

    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Configure</h2>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Type
                </label>
                <p className="text-sm text-gray-300">{selectedNode.data.type}</p>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Label
                </label>
                <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                    className="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Latency (ms)
                </label>
                <input
                    type="number"
                    value={selectedNode.data.latency ?? ""}
                    onChange={(e) =>
                        updateNode(selectedNode.id, { latency: Number(e.target.value) })
                    }
                    placeholder="e.g. 50"
                    className="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Capacity (RPS)
                </label>
                <input
                    type="number"
                    value={selectedNode.data.capacity ?? ""}
                    onChange={(e) =>
                        updateNode(selectedNode.id, { capacity: Number(e.target.value) })
                    }
                    placeholder="e.g. 1000"
                    className="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Error Rate (%)
                </label>
                <input
                    type="number"
                    value={selectedNode.data.errorRate ?? ""}
                    onChange={(e) =>
                        updateNode(selectedNode.id, { errorRate: Number(e.target.value) })
                    }
                    placeholder="e.g. 5"
                    className="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
    )
}