import Canvas from "@/components/Canvas"
import Toolbar from "@/components/Toolbar"

export default function Home() {
    return (
        <main className="flex">
            <Toolbar />
            <div className="flex-1">
                <Canvas />
            </div>
        </main>
    )
}