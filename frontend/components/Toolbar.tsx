"use client"

import { useGraphStore } from "@/store/graphStore"

const COMPONENTS = [
    { type: "client",       label: "Client",       emoji: "💻", group: "Traffic" },
    { type: "cdn",          label: "CDN",          emoji: "🌐", group: "Traffic" },
    { type: "apiGateway",   label: "API Gateway",  emoji: "🚪", group: "Traffic" },
    { type: "loadBalancer", label: "Load Balancer",emoji: "⚖️", group: "Traffic" },
    { type: "service",      label: "Service",      emoji: "⚙️", group: "Compute" },
    { type: "lambda",       label: "Lambda",       emoji: "λ",  group: "Compute" },
    { type: "worker",       label: "Worker",       emoji: "👷", group: "Compute" },
    { type: "postgres",     label: "PostgreSQL",   emoji: "🐘", group: "Data" },
    { type: "redis",        label: "Redis",        emoji: "⚡", group: "Data" },
    { type: "s3",           label: "S3",           emoji: "🪣", group: "Data" },
    { type: "sqs",          label: "SQS",          emoji: "📬", group: "Messaging" },
    { type: "kafka",        label: "Kafka",        emoji: "📨", group: "Messaging" },
]

const GROUPS = ["Traffic", "Compute", "Data", "Messaging"]

export default function Toolbar() {
    const addNode = useGraphStore((state) => state.addNode)

    return (
        <div className="w-56 h-screen bg-gray-900 text-white p-4 flex flex-col gap-6 overflow-y-auto">
            <h2 className="text-lg font-bold">Components</h2>

            {GROUPS.map((group) => (
                <div key={group}>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                        {group}
                    </p>
                    <div className="flex flex-col gap-1">
                        {COMPONENTS.filter((c) => c.group === group).map((component) => (
                            <button
                                key={component.type}
                                onClick={() => addNode(component.type, component.label)}
                                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 text-sm text-left transition-colors"
                            >
                                <span>{component.emoji}</span>
                                <span>{component.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}