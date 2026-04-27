export default function PanelModal({ panel, onClose, onNext, onPrev }) {
    if (!panel) return null;

    return (
        <div className="modalBackdrop" onClick={onClose} role="presentation">
            <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modalTop">
                    <div className="modalText">
                        <div className="modalTitle">{panel.title}</div>
                        <div className="modalCaption">{panel.caption}</div>
                    </div>
                    <button className="x" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className="modalBody">
                    <img className="modalImg" src={panel.img} alt={panel.title} />
                </div>

                <div className="modalBottom">
                    <div className="tags">
                        {panel.tags.map((t) => (
                            <span className="tag" key={t}>{t}</span>
                        ))}
                    </div>

                    <div className="nav">
                        <button onClick={onPrev}>Prev</button>
                        <button onClick={onNext}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}