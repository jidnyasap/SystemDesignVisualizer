"use client"

import { useGraphStore } from "@/store/graphStore"

export default function ResultsPanel() {
    const simulationResult = useGraphStore((state) => state.simulationResult)
    const clearSimulation = useGraphStore((state) => state.clearSimulation)

    if (!simulationResult) return null

    return (
        <div className="h-60 bg-gray-900 border-t border-gray-700 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <h3 className="text-white font-semibold text-sm">Simulation Results</h3>
                    <span className="text-gray-400 text-xs">
            {simulationResult.completed_requests} / {simulationResult.total_requests} requests completed
          </span>
                    <span className="text-gray-400 text-xs">
            {simulationResult.dropped_requests} dropped
          </span>
                    <span className="text-gray-400 text-xs">
            {simulationResult.duration}s duration
          </span>
                </div>
                <button
                    onClick={clearSimulation}
                    className="text-gray-400 hover:text-white text-xs"
                >
                    Clear
                </button>
            </div>

            <table className="w-full text-sm">
                <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-700">
                    <th className="text-left px-4 py-2">Component</th>
                    <th className="text-right px-4 py-2">Avg Latency</th>
                    <th className="text-right px-4 py-2">Throughput</th>
                    <th className="text-right px-4 py-2">Error Rate</th>
                    <th className="text-right px-4 py-2">Queue Depth</th>
                    <th className="text-right px-4 py-2">Status</th>
                </tr>
                </thead>
                <tbody>
                {simulationResult.nodes.map((node) => (
                    <tr
                        key={node.node_id}
                        className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                        <td className="px-4 py-2 text-white font-medium">{node.label}</td>
                        <td className="px-4 py-2 text-right text-gray-300">
                            {node.avg_latency}ms
                        </td>
                        <td className="px-4 py-2 text-right text-gray-300">
                            {node.throughput} RPS
                        </td>
                        <td className={`px-4 py-2 text-right font-medium ${
                            node.error_rate > 10 ? "text-red-400" : "text-green-400"
                        }`}>
                            {node.error_rate}%
                        </td>
                        <td className={`px-4 py-2 text-right font-medium ${
                            node.queue_depth > 10 ? "text-red-400" : "text-gray-300"
                        }`}>
                            {node.queue_depth}
                        </td>
                        <td className="px-4 py-2 text-right">
                            {node.is_bottleneck ? (
                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    Bottleneck
                  </span>
                            ) : (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Healthy
                  </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}