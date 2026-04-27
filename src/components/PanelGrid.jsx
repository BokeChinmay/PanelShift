export default function PanelGrid({
    panels,
    focusMode,
    viewedIds,
    onPanelClick,
}) {
    return (
        <div className="grid">
            {panels.map((p) => (
                <button
                    key={p.id}
                    className={`panel ${viewedIds.includes(p.id) ? "viewed" : ""} ${focusMode && !viewedIds.includes(p.id) ? "dim" : ""}`}
                    onClick={() => onPanelClick(p)}
                    aria-label={`Open panel ${p.id}: ${p.title}`}
                >
                    <img src={p.img} alt={p.title} />
                    {viewedIds.includes(p.id) && <div className="seenDot" />}
                    {/* <div className="badge">{p.id}</div> */}
                </button>
            ))}
        </div>
    );
}