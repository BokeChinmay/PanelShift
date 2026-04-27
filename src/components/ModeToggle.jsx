export default function ModeToggle({ mode, setMode }) {
    return (
        <div className="toggle">
            <button
                className={mode === "control" ? "active" : ""}
                onClick={() => setMode("control")}
            >
                Control
            </button>
            <button
                className={mode === "disruption" ? "active" : ""}
                onClick={() => setMode("disruption")}
            >
                Disruption
            </button>
        </div>
    );
}