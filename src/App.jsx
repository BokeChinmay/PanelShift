import { useMemo, useState } from "react";
import { PANELS, TAGS } from "./data/panels";
import ModeToggle from "./components/ModeToggle";
import PanelGrid from "./components/PanelGrid";
import PanelModal from "./components/PanelModal";
import Results from "./components/Results";
import "./styles/app.css";

function computeSummary(order) {
  // Score tags (first 3 clicks count extra)
  const scores = Object.fromEntries(TAGS.map((t) => [t, 0]));

  order.forEach((p, idx) => {
    const weight = idx < 3 ? 2 : 1;
    p.tags.forEach((t) => (scores[t] += weight));
  });

  // Helper to get top tags
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topTag, topScore] = sorted[0];
  const [secondTag] = sorted[1];

  // Outcomes (keep it explainable)
  const outcomes = {
    PANOPTICON: {
      title: "Panopticon Reading",
      text:
        "Your reading leaned heavily on The Eye, The Grid, and ID, especially if any of those appeared in your first few clicks. That order emphasizes that your page is sorted logically. The viewer first meets the gaze of the character, looks at their label (name, characteristics), and then places them in that box. If you clicked Broadcast early, it strengthens that by accepting the narrative that is set. Even if you eventually clicked Crack or Silence, they register as controlled disruptions of your reading. The sequence that you built keeps returning to the legibility of the subject. In essence, your choices made the structure feel natural, and the meaning feel delivered.",
    },
    ESCAPE: {
      title: "Escape Reading",
      text:
        "This reading usually happens when you click The Mask and Crack early, then follow with The Door soon after. That sequence pulls the page away from classification and toward interpretation. You let the identity be revealed instead of looking for answers; it is something to be inferred rather than assigned. The cracks in the information given to you are meant to be pieced together like evidence. You use these to pivot past the page’s blatant information and look at them as gaps and opportunities. If The Grid or ID show up later in your narrative, the gaps don’t disappear, but press back into the mold you’ve already established. In essence, your choices make the page deviate from fixed meanings and explore your own story.",
    },
    FEAR: {
      title: "Fear Spiral Reading",
      text:
        "You likely triggered this by clicking Broadcast and Crowd early, and then reinforcing it with The Eye or The Grid. When broadcast comes early, it sets a tone of pressure. The information itself becomes the atmosphere of the page. When the crowd follows, you disperse this information into the crowd, an act of blending in. If you later return to the surveillance panels, the fear and discomfort propagate through the structure, and the control you seek validates the fear. In essence, your order changes the structure of the page into a slow escalation.",
    },
    COLLECTIVE: {
      title: "Collective Meaning Reading",
      text:
        "This outcome tends to appear when Crowd and The Door show up mid-to-late, especially if your early clicks weren’t dominated by Eye/Grid/ID. Clicking Crowd later reframes your structure, as you negotiate space within the page. When you follow with The Door, the page shifts from being about control to being about openings and gaps where meaning can be formed. If Silence appears towards the end, it acts like a void that begs for meaning to be interpreted. In this sequence, disruption feels social rather than at the individual level, so the meaning is formed in the gutter.",
    },
    AMBIGUITY: {
      title: "Ambiguity Reading",
      text:
        "You get this when your clicks interleave the control panels (Eye/Grid/ID/Broadcast) with disruption panels (Mask/Crack/Door/Silence) instead of clustering one side. Because your early sequence doesn’t commit, the page never settles into a single argument. For example, clicking The Eye early but then jumping to The Mask changes how you portray or read into a character. You change the script and the characteristics of the person you see. If Silence appears mid-sequence, it becomes the pivot, where the emptiness forces you to make connections, so the gutters start doing more work than the panels. Ending on Rose also shifts the tone, as the complexity of the narrative you’ve built is an open-ended climax, without an objective plot resolution. In essence, your order makes the entire narrative like an experiment in framing.",
    },
  };

  const controlish = scores.SURVEILLANCE + scores.CONTROL;
  const disruptionish = scores.DISRUPTION + scores.IDENTITY;
  const fearish = scores.FEAR;
  const communityish = scores.COMMUNITY;

  const firstFourIds = order.slice(0, 4).map((p) => p.id);
  const hasEarlyBroadcast = firstFourIds.includes(4);
  const hasEarlyCrowd = firstFourIds.includes(5);

  if (fearish >= 4 && hasEarlyBroadcast && hasEarlyCrowd) return outcomes.FEAR;
  if (communityish >= 4 && scores.DISRUPTION >= 3) return outcomes.COLLECTIVE;
  if (controlish >= disruptionish + 3) return outcomes.PANOPTICON;
  if (disruptionish >= controlish + 3) return outcomes.ESCAPE;
  return outcomes.AMBIGUITY;
}

export default function App() {
  const [order, setOrder] = useState([]); // array of panel objects in click order
  const [active, setActive] = useState(null); // current modal panel
  const [showResults, setShowResults] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const viewedIds = useMemo(() => order.map((p) => p.id), [order]);
  const summary = useMemo(() => computeSummary(order), [order]);

  function openPanel(p) {
    setActive(p);
    setOrder((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p]));
  }

  function nextInAllPanels() {
    if (!active) return;
    const idx = PANELS.findIndex((p) => p.id === active.id);
    setActive(PANELS[(idx + 1) % PANELS.length]);
  }

  function prevInAllPanels() {
    if (!active) return;
    const idx = PANELS.findIndex((p) => p.id === active.id);
    setActive(PANELS[(idx - 1 + PANELS.length) % PANELS.length]);
  }

  function reset() {
    setOrder([]);
    setActive(null);
    setShowResults(false);
    setFocusMode(false);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="headerLeft">
          <h1>PanelShift</h1>
          <p className="sub">
            Click panels in any order. See how order reshapes meaning.
          </p>
        </div>

        <div className="headerRight card">
          <div className="meta">
            <div className="progress">{order.length}/10 viewed</div>
            <button
              className={`focusBtn ${focusMode ? "on" : ""}`}
              onClick={() => setFocusMode((v) => !v)}
            >
              Focus: {focusMode ? "On" : "Off"}
            </button>
            <button
              className="generate"
              onClick={() => setShowResults(true)}
              disabled={order.length < 6}
            >
              Generate reading
            </button>
          </div>
        </div>
      </header>
      {!showResults ? (
        <>
          <PanelGrid
            panels={PANELS}
            focusMode={focusMode}
            viewedIds={viewedIds}
            onPanelClick={openPanel}
          />

          <PanelModal
            panel={active}
            onClose={() => setActive(null)}
            onNext={nextInAllPanels}
            onPrev={prevInAllPanels}
          />

          <footer className="footer">
            Tip: You can toggle <b>Focus Mode</b> to highlight the currently selected panel. Try clicking panels in different orders to see how the narrative and meaning changes. Click at least 6 panels to generate a reading of your unique sequence.
          </footer>
        </>
      ) : (
        <Results
          panelsInOrder={order}
          summary={summary}
          onReset={reset}
        />
      )}
    </div>
  );
}