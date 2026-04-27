export default function Results({ panelsInOrder, summary, onReset }) {
    return (
        <div className="results">
            <div className="resultsHeader">
                <h2>Your reading</h2>
                <p className="resultsSub">
                    This summary reflects sequencing and emphasis, not a single “correct” meaning.
                </p>
                <button className="reset" onClick={onReset}>Start over</button>
            </div>

            <div className="path">
                {panelsInOrder.map((p, idx) => (
                    <div className="thumb" key={`${p.id}-${idx}`}>
                        <img src={p.img} alt={p.title} />
                        <div className="thumbIndex">{idx + 1}</div>
                    </div>
                ))}
            </div>

            <div className="summaryCard">
                <h3>{summary.title}</h3>
                <p>{summary.text}</p>
            </div>
        </div>
    );
}