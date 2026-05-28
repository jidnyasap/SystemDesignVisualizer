import Canvas from "@/components/Canvas"
import Toolbar from "@/components/Toolbar"
import ConfigPanel from "@/components/ConfigPanel"

export default function Home() {
    return (
        <main className="flex">
            <Toolbar />
            <div className="flex-1">
                <Canvas />
            </div>
            <ConfigPanel />
        </main>
    )
}