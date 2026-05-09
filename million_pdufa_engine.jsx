import { useState, useEffect, useCallback, useRef } from "react";

/* ─── CATALYST DATABASE ─── */
const CATALYSTS = [
  {
    id:"axsm", ticker:"AXSM", company:"Axsome Therapeutics", drug:"AXS-05 (Auvelity)",
    indication:"Alzheimer's Disease Agitation", pdufaDate:"2026-04-30", probability:78,
    status:"approved", designation:["Breakthrough","Priority Review"], tier:1,
    position:{shares:6, avgPrice:182.67, currentPrice:186.55},
    stopLoss:148.0, analystLow:198.82, analystHigh:260, analystConsensus:223.99,
    marketCap:"$9.5B", cash:"$325M", reviewType:"Priority", pathway:"sNDA",
    trialName:"ADVANCE-1, ACCORD-1/2", primaryEndpoint:"Met (3 of 4 Ph3)",
    safetyProfile:"Clean — no falls, no cognitive decline, no sedation",
    competitorContext:"Rexulti (brexpiprazole) only other approved. AXS-05 is non-antipsychotic mechanism.",
    keyRisk:"ADVANCE-2 missed stat sig. Earnings May 4 could disappoint on EPS.",
    notes:"Approved April 30. Modest ~2% move = priced in. Hold through May 4 earnings with 10% trailing stop."
  },
  {
    id:"vrdn", ticker:"VRDN", company:"Viridian Therapeutics", drug:"Veligrotug (IV)",
    indication:"Thyroid Eye Disease (TED)", pdufaDate:"2026-06-30", probability:75,
    status:"active", designation:["Breakthrough","Priority Review"], tier:1,
    position:{shares:50, avgPrice:15.10, currentPrice:15.12},
    stopLoss:10.0, analystLow:33, analystHigh:45, analystConsensus:39,
    marketCap:"$1.1B", cash:"$875M", reviewType:"Priority", pathway:"BLA",
    trialName:"THRIVE, THRIVE-2", primaryEndpoint:"Met all primary & secondary",
    safetyProfile:"Well-tolerated. Consistent with FcRn inhibitor class.",
    competitorContext:"Tepezza (teprotumumab) is SOC. Veligrotug first to show diplopia resolution in chronic TED.",
    keyRisk:"REVEAL-1 elegrobart disappointment overhang. Market sentiment depressed.",
    notes:"Contrarian entry post-REVEAL-1. IV veligrotug data is strong. $875M cash. Analyst targets $33-$45."
  },
  {
    id:"vera", ticker:"VERA", company:"Vera Therapeutics", drug:"Atacicept",
    indication:"IgA Nephropathy", pdufaDate:"2026-07-07", probability:75,
    status:"active", designation:["Breakthrough","Priority Review","Accelerated Approval"], tier:1,
    position:{shares:10, avgPrice:43.32, currentPrice:43.65},
    stopLoss:34.0, analystLow:56, analystHigh:82, analystConsensus:76,
    marketCap:"$2.5B", cash:"$714.6M", reviewType:"Priority", pathway:"BLA (Accelerated)",
    trialName:"ORIGIN Phase 3", primaryEndpoint:"Met: 46% proteinuria reduction, p<0.0001",
    safetyProfile:"Favorable. No major safety signals in ORIGIN.",
    competitorContext:"VOYXACT (Otsuka) approved. Vertex advancing. Atacicept dual BAFF/APRIL is differentiated.",
    keyRisk:"Surrogate endpoint debate. Confirmatory trial required post-approval.",
    notes:"Tranche 1 of 3. Published in NEJM. Deploy tranches 2 & 3 by early May. Potential M&A target."
  },
  {
    id:"rvmd", ticker:"RVMD", company:"Revolution Medicines", drug:"Daraxonrasib",
    indication:"KRAS G12C Pancreatic Cancer", pdufaDate:"2027-01-15", probability:82,
    status:"limit_order", designation:["Breakthrough"], tier:3,
    position:{shares:0, avgPrice:0, currentPrice:144.38, limitPrice:112.0},
    stopLoss:88.0, analystLow:140, analystHigh:170, analystConsensus:155,
    marketCap:"$28.4B", cash:"$2.03B", reviewType:"TBD (NDA not filed)", pathway:"NDA",
    trialName:"RASolute 302 Phase 3", primaryEndpoint:"Met: mOS 13.2 vs 6.7 months, HR 0.40",
    safetyProfile:"Manageable. Consistent with RAS(ON) inhibitor class.",
    competitorContext:"First RAS(ON) multi-selective inhibitor. No approved KRAS G12C for pancreatic.",
    keyRisk:"Post-gap euphoria. Equity offering likely. Wait for $112 pullback.",
    notes:"GTC limit 5 shares @ $112. Waiting for pullback. NDA filing expected Q3 2026."
  },
  {
    id:"grce", ticker:"GRCE", company:"Grace Therapeutics", drug:"GTx-104 (IV Nimodipine)",
    indication:"Aneurysmal SAH", pdufaDate:"2026-04-23", probability:67,
    status:"expired", designation:["Orphan Drug","505(b)(2)"], tier:2,
    position:{shares:0, avgPrice:0, currentPrice:4.65, limitPrice:3.85},
    stopLoss:2.50, analystLow:null, analystHigh:12, analystConsensus:12,
    marketCap:"$72M", cash:"$18.7M", reviewType:"Standard", pathway:"NDA 505(b)(2)",
    trialName:"STRIVE-ON Phase 3", primaryEndpoint:"Safety/PK bridging (505b2)",
    safetyProfile:"Clean. Consistent with known nimodipine profile.",
    competitorContext:"No IV nimodipine exists. 40-year gap in aSAH innovation.",
    keyRisk:"Manufacturing/CMC. Cash runway tight. Stock ran past $4.64 chase limit.",
    notes:"Limit at $3.85 did not fill. Stock ran away. PDUFA April 23 — awaiting result."
  },
  {
    id:"argx", ticker:"ARGX", company:"Argenx", drug:"VYVGART",
    indication:"Seronegative Myasthenia Gravis", pdufaDate:"2026-05-10", probability:80,
    status:"watchlist", designation:["Label Expansion"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$36B", cash:">$3B", reviewType:"Standard", pathway:"sBLA",
    trialName:"Label expansion study", primaryEndpoint:"Demonstrated efficacy in seronegative gMG",
    safetyProfile:"Established (VYVGART already approved and marketed globally)",
    competitorContext:"Soliris/Ultomiris (Alexion) in gMG. VYVGART is market leader.",
    keyRisk:"Seronegative population smaller. FDA may want longer follow-up.",
    notes:"$36B company. Low binary risk. 5-10% pop on approval. Good capital parking spot."
  },
  {
    id:"biib", ticker:"BIIB", company:"Biogen / Eisai", drug:"LEQEMBI IQLIK",
    indication:"Alzheimer's (SubQ Autoinjector)", pdufaDate:"2026-05-24", probability:90,
    status:"watchlist", designation:["Device/Formulation"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$25B", cash:">$5B", reviewType:"Standard", pathway:"sBLA",
    trialName:"Bioequivalence/PK studies", primaryEndpoint:"PK bridging to IV formulation",
    safetyProfile:"Established (Leqembi already approved)",
    competitorContext:"Kisunla (donanemab) is competitor. SubQ removes infusion barrier.",
    keyRisk:"Device malfunction or delivery inconsistency. Very low rejection risk.",
    notes:"90% probability. Device change only. Massive commercial impact (home vs. infusion center)."
  },
  {
    id:"cing", ticker:"CING", company:"Cingulate", drug:"CTx-1301",
    indication:"ADHD (Once-daily dexmethylphenidate)", pdufaDate:"2026-05-31", probability:70,
    status:"watchlist", designation:["505(b)(2)"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"~$35M", cash:"~$8M", reviewType:"Standard", pathway:"NDA 505(b)(2)",
    trialName:"Adult & Pediatric Phase 3", primaryEndpoint:"Met dose-dependent improvements (ADHD-RS-5, CGI-I)",
    safetyProfile:"No serious TEAEs. Consistent with methylphenidate class.",
    competitorContext:"$20B+ ADHD market. Crowded but PTR delivery is novel.",
    keyRisk:"Manufacturing/CMC for novel triple-bead system. Nano-cap liquidity risk.",
    notes:"⚠️ Max $300-500 position. Nano-cap binary. Known molecule, novel delivery. PDUFA fee waiver granted."
  },
  {
    id:"lnth", ticker:"LNTH", company:"Lantheus Holdings", drug:"LNTH-2501 (Ga 68 edotreotide)",
    indication:"SSTR+ Neuroendocrine Tumors (PET)", pdufaDate:"2026-06-29", probability:75,
    status:"watchlist", designation:["Standard Review"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$5.5B", cash:">$400M", reviewType:"Standard (extended 3 months)", pathway:"NDA",
    trialName:"Diagnostic imaging studies", primaryEndpoint:"Imaging performance for SSTR+ NET localization",
    safetyProfile:"Diagnostic agent — minimal systemic exposure",
    competitorContext:"Expands Lantheus radiopharm franchise (PYLARIFY already $1.4B revenue).",
    keyRisk:"3-month extension was for manufacturing review — CMC is the primary concern.",
    notes:"Proven commercial company adding diagnostic product. Lower binary risk. Franchise extension play."
  },
  {
    id:"nuvl", ticker:"NUVL", company:"Nuvalent", drug:"Zidesamtinib",
    indication:"ROS1+ NSCLC (TKI pre-treated)", pdufaDate:"2026-09-18", probability:80,
    status:"pipeline", designation:["Breakthrough","Orphan Drug"], tier:1,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$8.5B", cash:"$1.8B", reviewType:"Standard", pathway:"NDA",
    trialName:"ARROS-1 Phase 1/2 (registrational)", primaryEndpoint:"Deep durable responses in TKI-pretreated ROS1+ NSCLC",
    safetyProfile:"Manageable. Brain-penetrant with CNS activity.",
    competitorContext:"Repotrectinib, taletrectinib available. Zidesamtinib shows activity post these agents.",
    keyRisk:"Small patient population (ROS1+ is ~2% of NSCLC). Orphan but niche.",
    notes:"NEXT TIER 1 ENTRY. Window opens July/August. Deploy VRDN proceeds. Commercial prep underway."
  },
  {
    id:"bpmc", ticker:"BPMC", company:"PharmaEssentia", drug:"Besremi (ropeginterferon alfa-2b)",
    indication:"Essential Thrombocythemia", pdufaDate:"2026-08-30", probability:70,
    status:"pipeline", designation:["Label Expansion"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$3B", cash:">$200M", reviewType:"Standard", pathway:"sNDA",
    trialName:"ET expansion studies", primaryEndpoint:"Efficacy in essential thrombocythemia",
    safetyProfile:"Established (Besremi approved for PV)",
    competitorContext:"Hydroxyurea is SOC. Besremi is disease-modifying alternative.",
    keyRisk:"ET market smaller than PV. Incremental rather than transformative.",
    notes:"Already approved for PV. Lower-risk label expansion. Conservative play."
  },
  {
    id:"axsm12", ticker:"AXSM", company:"Axsome Therapeutics", drug:"AXS-12 (Reboxetine)",
    indication:"Narcolepsy (Cataplexy)", pdufaDate:"2026-12-15", probability:75,
    status:"pipeline", designation:["Orphan Drug"], tier:2,
    position:null, stopLoss:null, analystLow:null, analystHigh:null, analystConsensus:null,
    marketCap:"$9.5B", cash:"$325M", reviewType:"Standard (expected)", pathway:"NDA",
    trialName:"SYMPHONY + ENCORE Phase 3", primaryEndpoint:"Both positive on cataplexy reduction",
    safetyProfile:"Reboxetine is well-characterized globally (approved in EU for decades).",
    competitorContext:"Xyrem/Xywav (Jazz) dominate. Reboxetine is oral, non-scheduled alternative.",
    keyRisk:"Standard review = longer timeline. NDA was 'submitted imminently' per Q4 call.",
    notes:"Potential second AXSM PDUFA trade. Orphan designation. Entry window Q3 2026."
  }
];

const TODAY = new Date("2026-05-08");
const getDaysUntil = (d) => Math.ceil((new Date(d+"T00:00:00") - TODAY) / 864e5);
const fmt = (n) => n == null ? "—" : "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK = (n) => n >= 1e6 ? "$"+(n/1e6).toFixed(1)+"M" : n >= 1e3 ? "$"+(n/1e3).toFixed(1)+"K" : fmt(n);

const STATUS_MAP = {
  approved:{l:"APPROVED",c:"#00c087",bg:"#0a2e1f"},
  active:{l:"ACTIVE",c:"#00a3ff",bg:"#0a1e2e"},
  limit_order:{l:"LIMIT ORDER",c:"#a78bfa",bg:"#1a152e"},
  watchlist:{l:"WATCHLIST",c:"#8899aa",bg:"#141a20"},
  pipeline:{l:"PIPELINE",c:"#fbbf24",bg:"#1e1a0a"},
  expired:{l:"EXPIRED",c:"#4b5563",bg:"#111318"},
  rejected:{l:"CRL",c:"#ff4d4d",bg:"#2e0a0a"}
};

function computeRiskScore(item) {
  let score = item.probability;
  const days = getDaysUntil(item.pdufaDate);
  if (item.designation.includes("Breakthrough")) score += 5;
  if (item.designation.includes("Priority Review")) score += 3;
  if (item.designation.includes("Orphan Drug")) score += 2;
  if (item.designation.includes("Accelerated Approval")) score += 2;
  if (item.pathway === "505(b)(2)" || item.pathway === "sBLA" || item.pathway === "sNDA") score += 3;
  if (item.primaryEndpoint?.toLowerCase().includes("met")) score += 3;
  if (item.safetyProfile?.toLowerCase().includes("clean") || item.safetyProfile?.toLowerCase().includes("well-tolerated")) score += 2;
  if (item.keyRisk?.toLowerCase().includes("manufacturing") || item.keyRisk?.toLowerCase().includes("cmc")) score -= 5;
  if (item.cash && item.cash.includes("<")) score -= 3;
  return Math.min(99, Math.max(10, score));
}

function getRecommendation(item) {
  const days = getDaysUntil(item.pdufaDate);
  const riskScore = computeRiskScore(item);
  const hasPos = item.position?.shares > 0;

  if (item.status === "approved") {
    return { action: "MANAGE", color: "#00c087", text: "Approved. Tighten stop to trailing 10%. Review at next earnings." };
  }
  if (item.status === "expired" || item.status === "rejected") {
    return { action: "CLOSED", color: "#4b5563", text: "Position expired or resolved. No action." };
  }
  if (days < 0) {
    return { action: "RESOLVED", color: "#4b5563", text: "PDUFA date has passed." };
  }
  if (hasPos && days <= 7) {
    return { action: "DECISION WEEK", color: "#ff4d4d", text: "PDUFA imminent. Verify stop loss is active. Decide: hold through or sell run-up by Tuesday." };
  }
  if (hasPos && days <= 21) {
    return { action: "MONITOR", color: "#fbbf24", text: "Approaching PDUFA. Watch for early FDA action, insider activity, and prediction market shifts." };
  }
  if (hasPos) {
    return { action: "HOLD", color: "#00a3ff", text: "Position active. Stop in place. Next review at 3-week mark before PDUFA." };
  }
  if (item.status === "limit_order") {
    return { action: "WAITING", color: "#a78bfa", text: `Limit order open. Monitor for fill. ${days < 14 ? "Consider raising limit — running out of runway." : "Patience."}` };
  }
  if (riskScore >= 78 && days >= 28 && days <= 84) {
    return { action: "ENTRY WINDOW", color: "#00c087", text: `High-conviction setup (${riskScore}/100). Ideal entry window: 4-12 weeks out. Consider scaling in.` };
  }
  if (riskScore >= 70 && days >= 14 && days <= 84) {
    return { action: "EVALUATE", color: "#fbbf24", text: `Moderate-high conviction (${riskScore}/100). Research before entry. Check liquidity and position sizing.` };
  }
  if (days > 84) {
    return { action: "TOO EARLY", color: "#8899aa", text: `${days} days to PDUFA. Monitor. Entry window opens at ~12 weeks out.` };
  }
  if (days < 14 && !hasPos) {
    return { action: "LATE ENTRY", color: "#ff4d4d", text: "Entry window closing. Most upside likely priced in. Higher risk/lower reward." };
  }
  return { action: "WATCH", color: "#8899aa", text: "On watchlist. No immediate action required." };
}

function RiskGauge({ score, size=52 }) {
  const r = (size-6)/2, circ = 2*Math.PI*r;
  const pct = score/100;
  const color = score >= 80 ? "#00c087" : score >= 70 ? "#fbbf24" : score >= 60 ? "#ff8c00" : "#ff4d4d";
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={3.5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3.5}
        strokeDasharray={circ} strokeDashoffset={circ-(pct*circ)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size*0.26} fontWeight="700" fontFamily="'IBM Plex Mono',monospace"
        style={{transform:"rotate(90deg)",transformOrigin:"center"}}>{score}</text>
    </svg>
  );
}

function CatalystRow({ item, expanded, onToggle }) {
  const days = getDaysUntil(item.pdufaDate);
  const st = STATUS_MAP[item.status] || STATUS_MAP.watchlist;
  const riskScore = computeRiskScore(item);
  const rec = getRecommendation(item);
  const hasPos = item.position?.shares > 0;
  const pnl = hasPos ? (item.position.currentPrice - item.position.avgPrice) * item.position.shares : null;
  const pnlPct = hasPos ? ((item.position.currentPrice - item.position.avgPrice) / item.position.avgPrice * 100) : null;
  const costBasis = hasPos ? item.position.shares * item.position.avgPrice : null;

  return (
    <div style={{
      background: expanded ? "rgba(255,255,255,0.03)" : "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.15s"
    }}>
      <div onClick={onToggle} style={{
        display:"grid", gridTemplateColumns:"48px 90px 1fr 120px 80px 60px 100px 140px",
        alignItems:"center", padding:"14px 16px", cursor:"pointer", gap:8,
        transition:"background 0.1s"
      }}
      onMouseEnter={e=>{if(!expanded) e.currentTarget.style.background="rgba(255,255,255,0.02)"}}
      onMouseLeave={e=>{if(!expanded) e.currentTarget.style.background="transparent"}}
      >
        <RiskGauge score={riskScore} size={40}/>
        
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#e8ecf1",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"-0.3px"}}>{item.ticker}</div>
          <div style={{fontSize:9,color:st.c,fontWeight:600,letterSpacing:"0.06em",marginTop:1}}>{st.l}</div>
        </div>

        <div>
          <div style={{fontSize:12,color:"#c4cdd8",fontWeight:500}}>{item.drug}</div>
          <div style={{fontSize:10,color:"#5a6577"}}>{item.indication}</div>
        </div>

        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
            color: days < 0 ? "#4b5563" : days <= 7 ? "#ff4d4d" : days <= 21 ? "#fbbf24" : "#8899aa"
          }}>
            {days < 0 ? "Resolved" : days === 0 ? "TODAY" : `${days}d`}
          </div>
          <div style={{fontSize:9,color:"#4b5563"}}>
            {new Date(item.pdufaDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
          </div>
        </div>

        <div style={{textAlign:"right",fontSize:12,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,
          color: item.probability >= 80 ? "#00c087" : item.probability >= 70 ? "#fbbf24" : "#ff4d4d"
        }}>
          {item.probability}%
        </div>

        <div style={{textAlign:"right"}}>
          <span style={{fontSize:9,fontWeight:700,color:TIER_CFG[item.tier].c,letterSpacing:"0.05em"}}>
            T{item.tier}
          </span>
        </div>

        <div style={{textAlign:"right"}}>
          {hasPos ? (
            <div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
                color: pnl >= 0 ? "#00c087" : "#ff4d4d"
              }}>{pnl >= 0 ? "+" : ""}{fmt(pnl)}</div>
              <div style={{fontSize:9,color: pnl >= 0 ? "#00c087" : "#ff4d4d"}}>{pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%</div>
            </div>
          ) : item.position?.limitPrice ? (
            <div style={{fontSize:11,color:"#a78bfa",fontFamily:"'IBM Plex Mono',monospace"}}>@{fmt(item.position.limitPrice)}</div>
          ) : (
            <div style={{fontSize:11,color:"#2d3544"}}>—</div>
          )}
        </div>

        <div>
          <span style={{
            fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:3,
            background: `${rec.color}15`, color:rec.color, letterSpacing:"0.04em"
          }}>{rec.action}</span>
        </div>
      </div>

      {expanded && (
        <div style={{
          padding:"0 16px 20px 16px",
          animation:"slideDown 0.2s ease"
        }}>
          <div style={{
            background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"18px 20px",
            border:"1px solid rgba(255,255,255,0.04)"
          }}>
            <div style={{
              display:"flex", alignItems:"center", gap:8, marginBottom:14,
              padding:"8px 12px", borderRadius:6,
              background:`${rec.color}10`, borderLeft:`3px solid ${rec.color}`
            }}>
              <span style={{fontSize:10,fontWeight:700,color:rec.color,letterSpacing:"0.06em"}}>{rec.action}</span>
              <span style={{fontSize:11,color:"#8899aa"}}>{rec.text}</span>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              <div>
                <div style={{fontSize:9,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Clinical Profile</div>
                <div style={{fontSize:11,color:"#8899aa",lineHeight:1.7}}>
                  <div><span style={{color:"#5a6577"}}>Trial:</span> {item.trialName}</div>
                  <div><span style={{color:"#5a6577"}}>Endpoint:</span> {item.primaryEndpoint}</div>
                  <div><span style={{color:"#5a6577"}}>Safety:</span> {item.safetyProfile}</div>
                  <div><span style={{color:"#5a6577"}}>Pathway:</span> {item.pathway} · {item.reviewType}</div>
                </div>
              </div>
              <div>
                <div style={{fontSize:9,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Market Context</div>
                <div style={{fontSize:11,color:"#8899aa",lineHeight:1.7}}>
                  <div><span style={{color:"#5a6577"}}>Mkt Cap:</span> {item.marketCap}</div>
                  <div><span style={{color:"#5a6577"}}>Cash:</span> {item.cash}</div>
                  <div><span style={{color:"#5a6577"}}>Competitive:</span> {item.competitorContext}</div>
                  {item.analystConsensus && <div><span style={{color:"#5a6577"}}>PT:</span> {fmt(item.analystConsensus)} ({fmt(item.analystLow)} – {fmt(item.analystHigh)})</div>}
                </div>
              </div>
              <div>
                <div style={{fontSize:9,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Risk & Position</div>
                <div style={{fontSize:11,color:"#8899aa",lineHeight:1.7}}>
                  <div><span style={{color:"#ff4d4d"}}>Key Risk:</span> {item.keyRisk}</div>
                  {hasPos && <>
                    <div><span style={{color:"#5a6577"}}>Shares:</span> {item.position.shares} @ {fmt(item.position.avgPrice)}</div>
                    <div><span style={{color:"#5a6577"}}>Cost Basis:</span> {fmt(costBasis)}</div>
                    <div><span style={{color:"#5a6577"}}>Stop Loss:</span> <span style={{color:"#ff4d4d"}}>{fmt(item.stopLoss)}</span></div>
                  </>}
                  {item.designation.length > 0 && <div><span style={{color:"#5a6577"}}>Designations:</span> {item.designation.join(", ")}</div>}
                </div>
              </div>
            </div>

            <div style={{marginTop:14,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:6,fontSize:11,color:"#5a6577",lineHeight:1.5}}>
              <span style={{fontWeight:600,color:"#8899aa"}}>Notes:</span> {item.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TIER_CFG = {1:{c:"#fbbf24"},2:{c:"#5a6577"},3:{c:"#3a4050"}};

function AiPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const ctx = CATALYSTS.map(c => `${c.ticker}: ${c.drug} for ${c.indication}. PDUFA ${c.pdufaDate}. Prob ${c.probability}%. Status: ${c.status}. ${c.position?.shares > 0 ? `Holding ${c.position.shares} shares @ $${c.position.avgPrice}. Stop $${c.stopLoss}.` : c.position?.limitPrice ? `Limit order @ $${c.position.limitPrice}` : "No position."} Risk score: ${computeRiskScore(c)}/100. Key risk: ${c.keyRisk}`).join("\n");
      
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a PDUFA catalyst trading analyst for a retail investor. Here is the current portfolio:\n\n${ctx}\n\nToday is May 8, 2026. Starting capital: $3,500. Answer concisely and directly like a Bloomberg terminal analyst. No disclaimers.\n\nQuestion: ${query}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No response received.";
      setResponse(text);
    } catch (err) {
      setResponse("Error connecting to analysis engine. " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background:"rgba(0,163,255,0.03)", border:"1px solid rgba(0,163,255,0.08)",
      borderRadius:8, padding:"16px 18px"
    }}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#00a3ff",boxShadow:"0 0 8px #00a3ff60"}}/>
        <span style={{fontSize:10,fontWeight:700,color:"#00a3ff",letterSpacing:"0.1em"}}>AI ANALYST</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter") analyze()}}
          placeholder="Ask about positions, risk, allocation, next moves..."
          style={{
            flex:1, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:6, padding:"10px 14px", color:"#c4cdd8", fontSize:12,
            fontFamily:"'IBM Plex Mono',monospace", outline:"none"
          }}
        />
        <button onClick={analyze} disabled={loading}
          style={{
            padding:"10px 20px", background:loading?"#1a2a3a":"#00a3ff", color:"#fff",
            border:"none", borderRadius:6, fontSize:11, fontWeight:700, cursor:loading?"wait":"pointer",
            letterSpacing:"0.04em", transition:"all 0.15s"
          }}>
          {loading ? "..." : "ANALYZE"}
        </button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:response?12:0,flexWrap:"wrap"}}>
        {["What should I do this week?","Portfolio risk assessment","Which position has the best risk/reward right now?","Capital allocation check","What's my next entry after VRDN?"].map((q,i)=>(
          <button key={i} onClick={()=>{setQuery(q);}} style={{
            fontSize:9,padding:"4px 10px",borderRadius:4,border:"1px solid rgba(0,163,255,0.15)",
            background:"transparent",color:"#4a7a9a",cursor:"pointer",transition:"all 0.15s"
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,163,255,0.08)";e.currentTarget.style.color="#00a3ff"}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#4a7a9a"}}
          >{q}</button>
        ))}
      </div>
      {response && (
        <div style={{
          background:"rgba(0,0,0,0.25)", borderRadius:6, padding:"14px 16px",
          fontSize:12, color:"#8899aa", lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace",
          whiteSpace:"pre-wrap", borderLeft:"2px solid #00a3ff30",
          maxHeight:300, overflowY:"auto"
        }}>{response}</div>
      )}
    </div>
  );
}

export default function MillionPDUFA() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [showAi, setShowAi] = useState(false);

  const filtered = CATALYSTS.filter(it => {
    if(filter==="all") return true;
    if(filter==="active") return ["active","approved"].includes(it.status);
    if(filter==="orders") return it.status==="limit_order";
    if(filter==="positions") return it.position?.shares > 0 || it.status==="limit_order";
    if(filter==="tier1") return it.tier===1;
    if(filter==="upcoming") return getDaysUntil(it.pdufaDate) > 0 && getDaysUntil(it.pdufaDate) <= 60;
    return true;
  }).sort((a,b) => {
    if(sort==="date") return new Date(a.pdufaDate)-new Date(b.pdufaDate);
    if(sort==="risk") return computeRiskScore(b)-computeRiskScore(a);
    if(sort==="tier") return a.tier-b.tier;
    if(sort==="pnl") {
      const pa = a.position?.shares > 0 ? (a.position.currentPrice-a.position.avgPrice)*a.position.shares : -Infinity;
      const pb = b.position?.shares > 0 ? (b.position.currentPrice-b.position.avgPrice)*b.position.shares : -Infinity;
      return pb-pa;
    }
    return 0;
  });

  const activePos = CATALYSTS.filter(c=>c.position?.shares>0);
  const deployed = activePos.reduce((s,c)=>s+c.position.shares*c.position.avgPrice,0);
  const current = activePos.reduce((s,c)=>s+c.position.shares*c.position.currentPrice,0);
  const totalPnl = current-deployed;
  const nextUp = CATALYSTS.filter(c=>getDaysUntil(c.pdufaDate)>0).sort((a,b)=>new Date(a.pdufaDate)-new Date(b.pdufaDate));
  const urgentCount = CATALYSTS.filter(c=>getDaysUntil(c.pdufaDate)>0&&getDaysUntil(c.pdufaDate)<=14&&(c.position?.shares>0||c.status==="limit_order")).length;

  return (
    <div style={{
      minHeight:"100vh",
      background:"#080b11",
      color:"#c4cdd8",
      fontFamily:"'IBM Plex Sans',-apple-system,sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1e2633; border-radius:3px; }
      `}</style>
      
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px"}}>
        
        {/* HEADER */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:3,height:24,background:"#00a3ff",borderRadius:2}}/>
              <h1 style={{fontSize:22,fontWeight:700,margin:0,color:"#e8ecf1",letterSpacing:"-0.5px",fontFamily:"'IBM Plex Sans',sans-serif"}}>
                MILLION <span style={{color:"#00a3ff"}}>PDUFA</span> ENGINE
              </h1>
            </div>
            <div style={{fontSize:10,color:"#3a4555",marginTop:4,marginLeft:13,fontFamily:"'IBM Plex Mono',monospace"}}>
              Catalyst-Driven Investment System · {CATALYSTS.length} opportunities · Updated {TODAY.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {urgentCount > 0 && (
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:4,background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.15)"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#ff4d4d",animation:"pulse 1.5s infinite"}}/>
                <span style={{fontSize:10,fontWeight:600,color:"#ff4d4d"}}>{urgentCount} URGENT</span>
              </div>
            )}
            <button onClick={()=>setShowAi(!showAi)} style={{
              padding:"6px 14px",borderRadius:5,border:"1px solid",cursor:"pointer",fontSize:10,fontWeight:700,
              letterSpacing:"0.06em",transition:"all 0.15s",
              background:showAi?"rgba(0,163,255,0.1)":"transparent",
              borderColor:showAi?"rgba(0,163,255,0.3)":"rgba(255,255,255,0.06)",
              color:showAi?"#00a3ff":"#5a6577"
            }}>
              AI ANALYST {showAi?"▲":"▼"}
            </button>
          </div>
        </div>

        {/* METRICS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
          {[
            {label:"DEPLOYED CAPITAL",value:fmt(deployed),sub:`${activePos.length} positions`,c:"#00a3ff"},
            {label:"UNREALIZED P&L",value:`${totalPnl>=0?"+":""}${fmt(totalPnl)}`,sub:deployed>0?`${(totalPnl/deployed*100).toFixed(1)}% return`:"—",c:totalPnl>=0?"#00c087":"#ff4d4d"},
            {label:"CURRENT VALUE",value:fmt(current),sub:"Mark to market",c:"#e8ecf1"},
            {label:"NEXT CATALYST",value:nextUp[0]?.ticker||"—",sub:nextUp[0]?`${getDaysUntil(nextUp[0].pdufaDate)}d · ${new Date(nextUp[0].pdufaDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}`:"",c:"#fbbf24"},
            {label:"PIPELINE DEPTH",value:`${CATALYSTS.filter(c=>getDaysUntil(c.pdufaDate)>0).length}`,sub:"Active opportunities",c:"#a78bfa"}
          ].map((m,i)=>(
            <div key={i} style={{
              background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",
              borderRadius:6,padding:"14px 16px"
            }}>
              <div style={{fontSize:8,color:"#3a4555",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,fontWeight:600}}>{m.label}</div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:m.c,letterSpacing:"-0.5px"}}>{m.value}</div>
              <div style={{fontSize:10,color:"#3a4555",marginTop:2}}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* AI PANEL */}
        {showAi && <div style={{marginBottom:20}}><AiPanel/></div>}

        {/* FILTERS */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2,padding:"10px 0"}}>
          <div style={{display:"flex",gap:3}}>
            {[
              {k:"all",l:"All"},
              {k:"positions",l:"My Positions"},
              {k:"upcoming",l:"Next 60d"},
              {k:"tier1",l:"Tier 1"},
              {k:"active",l:"Active"},
            ].map(f=>(
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{
                padding:"5px 12px",fontSize:10,fontWeight:600,border:"none",borderRadius:4,cursor:"pointer",
                background:filter===f.k?"rgba(0,163,255,0.1)":"transparent",
                color:filter===f.k?"#00a3ff":"#3a4555",transition:"all 0.15s"
              }}>{f.l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:3,alignItems:"center"}}>
            <span style={{fontSize:9,color:"#2d3544",marginRight:4}}>SORT</span>
            {[
              {k:"date",l:"Date"},{k:"risk",l:"Score"},{k:"tier",l:"Tier"},{k:"pnl",l:"P&L"}
            ].map(s=>(
              <button key={s.k} onClick={()=>setSort(s.k)} style={{
                padding:"3px 9px",fontSize:9,fontWeight:600,border:"1px solid",borderRadius:3,cursor:"pointer",
                background:sort===s.k?"rgba(255,255,255,0.04)":"transparent",
                borderColor:sort===s.k?"rgba(255,255,255,0.08)":"transparent",
                color:sort===s.k?"#8899aa":"#2d3544",transition:"all 0.15s"
              }}>{s.l}</button>
            ))}
          </div>
        </div>

        {/* TABLE HEADER */}
        <div style={{
          display:"grid",gridTemplateColumns:"48px 90px 1fr 120px 80px 60px 100px 140px",
          padding:"8px 16px",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)",
          fontSize:8,color:"#2d3544",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700
        }}>
          <div>SCORE</div><div>TICKER</div><div>DRUG / INDICATION</div>
          <div style={{textAlign:"right"}}>PDUFA</div>
          <div style={{textAlign:"right"}}>PROB</div>
          <div style={{textAlign:"right"}}>TIER</div>
          <div style={{textAlign:"right"}}>P&L</div>
          <div>SIGNAL</div>
        </div>

        {/* ROWS */}
        {filtered.map(item => (
          <CatalystRow key={item.id} item={item}
            expanded={expandedId===item.id}
            onToggle={()=>setExpandedId(expandedId===item.id?null:item.id)}
          />
        ))}

        {/* FOOTER */}
        <div style={{marginTop:24,fontSize:9,color:"#1a1f28",textAlign:"center",fontFamily:"'IBM Plex Mono',monospace"}}>
          MILLION PDUFA ENGINE · Research analysis for personal use · Not financial advice
        </div>
      </div>
    </div>
  );
}
