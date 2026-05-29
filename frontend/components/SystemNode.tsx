"use client"

import { Handle, Position } from "reactflow"
import { useGraphStore } from "@/store/graphStore"

const NODE_STYLES: Record<string, { bg: string; border: string; emoji: string }> = {
    client:       { bg: "#1e3a5f", border: "#3b82f6", emoji: "💻" },
    cdn:          { bg: "#3b1f5e", border: "#a855f7", emoji: "🌐" },
    apiGateway:   { bg: "#4a2500", border: "#f97316", emoji: "🚪" },
    loadBalancer: { bg: "#4a3800", border: "#eab308", emoji: "⚖️" },
    service:      { bg: "#1e1b4b", border: "#6366f1", emoji: "⚙️" },
    lambda:       { bg: "#4a1942", border: "#ec4899", emoji: "λ" },
    worker:       { bg: "#0f3330", border: "#14b8a6", emoji: "👷" },
    postgres:     { bg: "#1e3a5f", border: "#3b82f6", emoji: "🐘" },
    redis:        { bg: "#4a1515", border: "#ef4444", emoji: "⚡" },
    s3:           { bg: "#14390f", border: "#22c55e", emoji: "🪣" },
    sqs:          { bg: "#4a3200", border: "#f59e0b", emoji: "📬" },
    kafka:        { bg: "#1f2937", border: "#6b7280", emoji: "📨" },
}

const DEFAULT_STYLE = { bg: "#1f2937", border: "#6b7280", emoji: "⚙️" }

type SystemNodeProps = {
    id: string
    data: {
        label: string
        type: string
        latency?: number
        capacity?: number
        errorRate?: number
    }
    selected: boolean
}

export default function SystemNode({ id, data, selected }: SystemNodeProps) {
    const simulationResult = useGraphStore((state) => state.simulationResult)

    const nodeResult = simulationResult?.nodes.find((n) => n.node_id === id)
    const isBottleneck = nodeResult?.is_bottleneck ?? false
    const isHealthy = nodeResult && !isBottleneck

    const style = NODE_STYLES[data.type] ?? DEFAULT_STYLE

    const borderColor = isBottleneck
        ? "#ef4444"
        : isHealthy
            ? "#22c55e"
            : selected
                ? "#ffffff"
                : style.border

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div
                style={{
                    background: style.bg,
                    border: `2px solid ${borderColor}`,
                    borderRadius: "10px",
                    padding: "12px 16px",
                    minWidth: "140px",
                    boxShadow: isBottleneck
                        ? "0 0 12px rgba(239,68,68,0.5)"
                        : isHealthy
                            ? "0 0 12px rgba(34,197,94,0.4)"
                            : "0 2px 8px rgba(0,0,0,0.4)",
                    transition: "all 0.3s ease",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{style.emoji}</span>
                    <div>
                        <div style={{
                            color: "#ffffff",
                            fontWeight: 600,
                            fontSize: "13px",
                            lineHeight: 1.2
                        }}>
                            {data.label}
                        </div>
                        {nodeResult && (
                            <div style={{
                                color: isBottleneck ? "#fca5a5" : "#86efac",
                                fontSize: "10px",
                                marginTop: "2px"
                            }}>
                                {nodeResult.avg_latency}ms · {nodeResult.throughput} RPS
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    )
}