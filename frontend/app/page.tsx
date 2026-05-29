import Canvas from "@/components/Canvas"
import Toolbar from "@/components/Toolbar"
import ConfigPanel from "@/components/ConfigPanel"
import ResultsPanel from "@/components/ResultsPanel"

export default function Home() {
    return (
        <main className="flex">
            <Toolbar />
            <div className="flex-1 flex flex-col">
                <Canvas />
                <ResultsPanel />
            </div>
            <ConfigPanel />
        </main>
    )
}